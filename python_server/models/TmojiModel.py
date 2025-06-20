import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
import re
import spacy


nlp = spacy.load("en_core_web_sm")

# Ensure that the necessary NLTK resources are downloaded
nltk.download('wordnet')
nltk.download('omw-1.4')

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Emoji dictionary
comprehension_dict = {
  "medicine": "💊", "pill": "💊", "medication": "💊", "take": "👋",
  "doctor": "👨‍⚕️", "nurse": "👩‍⚕️", "appointment": "📅", "hospital": "🏥", "clinic": "🏥",
  "therapy": "🧠", "exercise": "🏃", "physical": "🏃", "speech": "🗣️",
  "blood": "🩸", "pressure": "🩸", "temperature": "🌡️", "heart": "❤️", "pulse": "💓",
  "xray": "📷", "scan": "📷", "test": "🔬", "results": "📄", "injection": "💉", "shot": "💉",
  "bandage": "🩹", "cast": "🦴", "crutches": "🩼", "oxygen": "💨", "allergy": "🤧",
  "dizzy": "💫", "nausea": "🤢", "vomit": "🤮", "itchy": "🦟", "rash": "🔴", "cough": "🤧",
  "eat": "🍽️", "drink": "🥤", "water": "💧", "food": "🍽️", "meal": "🍽️", "snack": "🍎",
  "breakfast": "🌅🍽️", "lunch": "☀️🍽️", "dinner": "🌆🍽️", "dessert": "🍰",
  "shower": "🚿", "bath": "🛁", "wash": "🧼", "brush": "🦷", "teeth": "🦷", "hair": "💇",
  "sleep": "😴", "nap": "😴", "rest": "😴", "bed": "🛏️", "awake": "👀", "wake": "⏰",
  "bathroom": "🚽", "toilet": "🚽", "diaper": "👶", "change": "🔄", "clean": "🧹", "dirty": "🧼",
  "clothes": "👕", "dress": "👗", "shirt": "👕", "pants": "👖", "shoes": "👟", "socks": "🧦",
  "laundry": "👕🌀", "dishes": "🍽️🧼", "cook": "👩‍🍳", "shop": "🛒", "drive": "🚗", "work": "💼",
  "go": "➡️", "come": "⬅️", "stay": "⏹️", "sit": "🪑", "stand": "🧍", "walk": "🚶", "run": "🏃",
  "give": "🤲", "take": "👋", "get": "🫳", "put": "⬇️", "bring": "➡️", "carry": "🏋️",
  "make": "🛠️", "do": "🔨", "have": "🫴", "use": "🖐️", "need": "🙏", "want": "🤲",
  "try": "🔧", "find": "🔍", "keep": "📥", "leave": "🚪", "open": "📂", "close": "📁",
  "start": "⏯️", "stop": "⏹️", "wait": "⏳", "help": "🆘", "show": "👀", "look": "👀",
  "ask": "🗣️", "tell": "💬", "talk": "💬", "speak": "💬", "listen": "👂", "hear": "👂",
  "read": "📖", "write": "✍️", "draw": "🎨", "play": "🎮", "watch": "📺", "call": "📞",
  "feel": "🤲", "hold": "🤝", "touch": "✋", "hug": "🫂", "love": "❤️", "like": "👍",
  "how": "❓", "what": "❓", "where": "❓", "when": "❓", "who": "❓", "why": "❓", "which": "❓",
  "feel": "😊", "feeling": "😊", "pain": "😣", "hurt": "😣", "okay": "👍", "wrong": "❌",
  "need": "🤲", "want": "🤲", "like": "👍", "comfortable": "😌", "ready": "✅",
  "hungry": "🍽️", "thirsty": "😰", "tired": "😴", "cold": "❄️", "hot": "🔥", "sick": "🤒",
  "now": "⏰", "today": "📅", "tomorrow": "📅", "yesterday": "📅⬅️", 
  "morning": "🌅", "afternoon": "☀️", "evening": "🌇", "night": "🌙", 
  "later": "⏰", "soon": "⏰", "early": "⏰⬆️", "late": "⏰⬇️",
  "minute": "⏰", "hour": "⏰", "day": "📅", "week": "📅7️⃣", "month": "📅30️⃣", "year": "📅365️⃣",
  "family": "👪", "visit": "👋", "visitor": "👥", "call": "📞", "phone": "📱", "text": "💬",
  "mom": "👩", "dad": "👨", "mother": "👩", "father": "👨", "wife": "👩", "husband": "👨",
  "son": "👦", "daughter": "👧", "child": "👶", "grandchild": "👶", "baby": "👶",
  "friend": "👫", "neighbor": "🏠👥", "pet": "🐕", "dog": "🐕", "cat": "🐈",
  "go": "➡️", "come": "⬅️", "stay": "⏹️", "sit": "🪑", "stand": "🧍", "walk": "🚶", "run": "🏃",
  "room": "🏠", "kitchen": "🍳", "bedroom": "🛏️", "living": "🛋️", "garden": "🌳", "yard": "🌱",
  "outside": "🌳", "inside": "🏠", "here": "📍", "there": "📍", "up": "⬆️", "down": "⬇️",
  "home": "🏠", "car": "🚗", "wheelchair": "♿", "stairs": "🪜", "elevator": "🛗",
  "help": "🆘", "emergency": "🚨", "911": "🚨", "fire": "🔥", "police": "👮", "danger": "⚠️",
  "safe": "✅", "careful": "⚠️", "stop": "✋", "fall": "⚠️", "hurt": "🤕", "accident": "🚑",
  "love": "❤️", "care": "❤️", "worry": "😔", "worry": "😟", "scared": "😨", "afraid": "😨",
  "happy": "😄", "sad": "😢", "angry": "😠", "mad": "😠", "calm": "🧘", "relax": "😌",
  "better": "📈", "worse": "📉", "same": "➡️", "improve": "📈", "heal": "❤️🩹", "well": "👍",
  "please": "🙏", "can": "❓", "could": "❓", "would": "❓", "will": "⏩", "shall": "❓",
  "open": "📂", "close": "📁", "turn": "🔄", "press": "👆", "push": "👆", "pull": "👇",
  "give": "🤲", "bring": "➡️", "show": "👀", "look": "👀", "listen": "👂", "wait": "⏳",
  "yes": "✅", "no": "❌", "maybe": "🤷", "ok": "👍", "okay": "👍", "alright": "👍",
  "sure": "✅", "fine": "👍", "good": "👍", "bad": "👎", "cannot": "❌", "not": "❌",
  "coffee": "☕", "tea": "🍵", "juice": "🧃", "milk": "🥛", "beer": "🍺", "wine": "🍷",
  "soda": "🥤", "cup": "☕", "glass": "🥛", "bottle": "🍾", "refresh": "💦", "ice": "🧊",
  "watermelon": "🍉", "lemon": "🍋", "apple": "🍎", "banana": "🍌", "bread": "🍞", "rice": "🍚",
  "?": "❓", "!": "❗", "let's": "🤝", "you": "🫵", "your": "🫵", "me": "👈", "my": "👈",
  "money": "💰", "keys": "🔑", "wallet": "👛", "remote": "📱", "light": "💡", "tv": "📺",
  "book": "📖", "game": "🎮", "music": "🎵", "party": "🎉", "gift": "🎁", "pray": "🙏",
  "hello": "👋", "hi": "👋", "hey": "👋", "greetings": "👋",
  "goodbye": "👋", "bye": "👋", "see you": "👋", "farewell": "👋",
  "good morning": "🌅👋", "good afternoon": "☀️👋", "good evening": "🌆👋", "good night": "🌙😴",
  "welcome": "🫂", "nice to meet you": "😊🤝", "howdy": "🤠👋",
  "please": "🙏", "thank you": "🙏❤️", "thanks": "🙏", "you're welcome": "😊👍",
  "excuse me": "🗣️", "pardon": "😅", "sorry": "😔", "my bad": "😅",
  "bless you": "🤧🙏", "take care": "❤️⚠️", "have a good day": "😊📅",
  "time": "⏰", "to": "➡️", 
}

phrase_dict = {
  "how be you": "❓🫵",
  "what be": "❓",
  "where be": "❓📍",
  "when be": "❓⏰",
  "who be": "❓👤",
  "why be": "❓",
  "do not": "❌",
  "be not": "❌",
  "will not": "❌⏩",
  "can not": "❌",
  "need to": "🙏",
  "want to": "🙏",
  "have to": "📋", 
  "go to": "➡️",
  "it be": "👉",
  
  "take medicine": "🗣️💊",
  "feel pain": "😣💢", 
  "call doctor": "📞👨‍⚕️",
  "go hospital": "➡️🏥",
  
  "use bathroom": "🚽🧻",
  "drink water": "💧🥤",
  "eat food": "🍽️", 
  "get dress": "👕👖",
  "take shower": "🚿🧼",
  "brush tooth": "🪥🦷",
  
  "love you": "❤️🫵",
  "miss you": "😢💭🫵",
  "see you": "👀👋", 
  "call family": "📞👪",
  "visit today": "👋📅🏠",

  "right now": "⏰❗",
  "later today": "⏰➡️📅",
  "every day": "📅🔄",
  "once a": "1️⃣📅",
  "twice a": "2️⃣📅",

  "call 911": "📞🚨👮",
  "need help": "🙏🆘", 
  "feel sick": "🤒🤢",
  "cannot breathe": "❌🫁😫",
  "hurt bad": "😣💢❗",

  "feel good": "😊👍",
  "feel bad": "😢👎",
  "be okay": "👍✅",
  "be safe": "✅🛡️",
  "feel better": "😊📈❤️",
  "do not": "❌",
  "can not": "❌",
  "do you": "❓🫵",
  "are you": "❓🫵",
  "can you": "❓🫵",
  "will you": "❓🫵",
}

contractions_dict = {
  # Specific irregular cases FIRST
  "won't": "will not",
  "can't": "cannot",
  "shan't": "shall not",
  "ain't": "am not",
  "ma'am": "madam",
  "o'clock": "of the clock",
  "y'all": "you all",
  
  # Informal contractions
  "gonna": "going to",
  "wanna": "want to", 
  "gotta": "got to",
  "hafta": "have to",
  "kinda": "kind of",
  "sorta": "sort of",
  "lotta": "lot of",
  "outta": "out of",
  "coulda": "could have",
  "shoulda": "should have",
  "woulda": "would have",
  "mighta": "might have",
  "musta": "must have",
  
  # Negative contractions (specific verbs first)
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
  "wasn't": "was not",
  "weren't": "were not",
  "isn't": "is not",
  "aren't": "are not",
  "doesn't": "does not",
  "didn't": "did not",
  "don't": "do not",
  "wouldn't": "would not",
  "shouldn't": "should not",
  "couldn't": "could not",
  "mightn't": "might not",
  "mustn't": "must not",
  "needn't": "need not",
  "daren't": "dare not",
  "usedn't": "used not",
  
  # Perfect tense contractions
  "should've": "should have",
  "could've": "could have", 
  "would've": "would have",
  "might've": "might have",
  "must've": "must have",
  "ought've": "ought have",
  
  # Specific pronoun + verb contractions
  "that's": "that is",
  "there's": "there is",
  "here's": "here is",
  "what's": "what is",
  "where's": "where is",
  "when's": "when is",
  "how's": "how is",
  "who's": "who is",
  "why's": "why is",
  "it's": "it is",
  "he's": "he is",
  "she's": "she is",
  "we're": "we are",
  "they're": "they are",
  "you're": "you are",
  "let's": "let us",
  
  # Perfect tense (have)
  "you've": "you have",
  "we've": "we have", 
  "they've": "they have",
  "i've": "i have",
  
  # Future tense (will)
  "you'll": "you will",
  "we'll": "we will",
  "they'll": "they will", 
  "i'll": "i will",
  "he'll": "he will",
  "she'll": "she will",
  "it'll": "it will",
  "that'll": "that will",
  "there'll": "there will",
  
  # Conditional (would)
  "you'd": "you would",
  "we'd": "we would",
  "they'd": "they would",
  "i'd": "i would", 
  "he'd": "he would",
  "she'd": "she would",
  "it'd": "it would",
  "that'd": "that would",
  "there'd": "there would",
  
  # First person singular
  "i'm": "i am",
  
  # General patterns LAST (to avoid conflicts)
  "n't": " not",
  "'re": " are", 
  "'ve": " have",
  "'ll": " will",
  "'d": " would",
  "'m": " am",
  "'s": " is",
}

# --- Helper Functions ---
# Function to convert contractions into non contraction text
def fix_contractions(text):  
  for contraction, expansion in contractions_dict.items():
    text = text.replace(contraction, expansion)
    
  return text


# Function to get the best synonym for a word based on the comprehension dictionary
def get_best_synonym(word, pos_tag=None):
  if word in comprehension_dict:
    return word
  
  important_words = ['need', 'do', 'be', 'have', 'go', 'get', 'want']
  if word in important_words:
    return word
  
  synonyms = wordnet.synsets(word, pos=pos_tag)
  for syn in synonyms:
    for lemma in syn.lemma_names():
      lemma_clean = lemma.replace('_', ' ').lower()
      if lemma_clean in comprehension_dict:
        return lemma_clean
  
  return word # fallback to original if no match

# Function to preprocess text
def preprocess_text(argText):
  # Lower and fix contractions
  text = argText.lower() 
  text = fix_contractions(text)
  # print(f"After contractions: {text}")        # TO REMOVE
  
  # Clean and Lemmatize
  text = re.sub(r'[^\w\s\?\!]', '', text)  # remove punctuation
  doc = nlp(text)
  
  lemmatized_words = []
  pos_tags = []
  
  for token in doc:
    if not token.is_punct and token.is_alpha:
      lemmatized_words.append(token.lemma_.lower())
      pos_tags.append(token.pos_)
    elif token.text in ['?', '!']:
      lemmatized_words.append(token.text)
      pos_tags.append('PUNCT')

  # Synonym replacement
  replaced_words = []
  for i, word in enumerate(lemmatized_words):
    if word in ['?', '!']:
      replaced_words.append(word)
    else:
      pos_map = {'NOUN': wordnet.NOUN, 'VERB': wordnet.VERB, 
                'ADJ': wordnet.ADJ, 'ADV': wordnet.ADV}
      wordnet_pos = pos_map.get(pos_tags[i], None)
      synonym = get_best_synonym(word, wordnet_pos)
      replaced_words.append(synonym)
    
  processed_text = " ".join(replaced_words)
  # print(f"After processing: {processed_text}")
  
  return {
    "processed_text": processed_text,
    "replaced_words": replaced_words
  }
  

# --- Main Function ---
def convert_to_emojis(text):
  #  Preprocess the text
  processed_data = preprocess_text(text)
  processed_text = processed_data["processed_text"]
  words_list = processed_text.split()    
  
  result_array = words_list.copy()  # Same length as original
  used_positions = set()
 
  # phrase first (need find their position and mark them so, it wont get lost)
  for phrase in sorted(phrase_dict.keys(), key=len, reverse=True):
    phrase_words = phrase.split()
    
    # Find where this phrase starts in the words_list
    for i in range(len(words_list) - len(phrase_words) + 1):
      if words_list[i:i+len(phrase_words)] == phrase_words:
        print(f"Found phrase: {phrase} -> {phrase_dict[phrase]} at position {i}")
        # Replace the first word with the phrase emoji
        result_array[i] = phrase_dict[phrase]
        
        # Mark all positions in this phrase as used
        for j in range(i, i + len(phrase_words)):
          used_positions.add(j)
          
        # Remove the other words in the phrase (set to None)
        for j in range(i + 1, i + len(phrase_words)):
          result_array[j] = None
        break
            
  
  # Individual words (fill remaining positions with individual word emojis)
  for i, word in enumerate(words_list):
    if i not in used_positions:  # Position not used by a phrase
      if word in comprehension_dict:
        result_array[i] = comprehension_dict[word]
        print(f"Found word: {word} -> {comprehension_dict[word]} at position {i}")
      else:
        result_array[i] = word
        # print(f"No emoji for: {word} -> keeping as '{word}' at position {i}")
  
  final_result = [item for item in result_array if item is not None]
  # result = " ".join(emoji_sequence)
  # print(f'Final result: {result}')
  return " ".join(final_result)

