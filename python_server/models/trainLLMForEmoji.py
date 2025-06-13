from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer, DataCollatorForLanguageModeling
from peft import prepare_model_for_kbit_training, LoraConfig, get_peft_model

# 1) Load your JSONL dataset
dataset = load_dataset("json", data_files="../data/emoji_dataset.jsonl")

# 2) Format it
def format_example(example):
    return {"text": f"{example['instruction']}\n{example['input']}\n{example['output']}"}
dataset = dataset.map(format_example)

# 3) Load tokenizer & model
model_name = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, load_in_4bit=True, device_map="auto")

# 4) Apply LoRA
model = prepare_model_for_kbit_training(model)
config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, config)

# 5) Setup training
training_args = TrainingArguments(
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    warmup_steps=10,
    max_steps=100,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=10,
    output_dir="./emoji-lora",
    save_strategy="no",
    report_to="none"
)
data_collator = DataCollatorForLanguageModeling(tokenizer, mlm=False)
trainer = Trainer(
    model=model,
    train_dataset=dataset["train"],
    args=training_args,
    tokenizer=tokenizer,
    data_collator=data_collator
)

# 6) Train
trainer.train()

# 7) Test inference
prompt = "Translate to emoji\nDo you want to drink some water?\n"
inputs = tokenizer(prompt, return_tensors="pt").input_ids.cuda()
outputs = model.generate(inputs, max_new_tokens=50)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))

# 8) Save merged model
model.save_pretrained("emoji-lora-merged")
tokenizer.save_pretrained("emoji-lora-merged")