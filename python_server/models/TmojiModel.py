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
  # Medical/Care instructions (expanded)
  "medicine": "💊", "pill": "💊", "medication": "💊", "take": "👋",
  "doctor": "👨‍⚕️", "nurse": "👩‍⚕️", "appointment": "📅", "hospital": "🏥", "clinic": "🏥",
  "therapy": "🧠", "exercise": "🏃", "physical": "🏃", "speech": "🗣️",
  "blood": "🩸", "pressure": "🩸", "temperature": "🌡️", "heart": "❤️", "pulse": "💓",
  "xray": "📷", "scan": "📷", "test": "🔬", "results": "📄", "injection": "💉", "shot": "💉",
  "bandage": "🩹", "cast": "🦴", "crutches": "🩼", "oxygen": "💨", "allergy": "🤧",
  "dizzy": "💫", "nausea": "🤢", "vomit": "🤮", "itchy": "🦟", "rash": "🔴", "cough": "🤧",
  
  # Daily care instructions (expanded)
  "eat": "🍽️", "drink": "🥤", "water": "💧", "food": "🍽️", "meal": "🍽️", "snack": "🍎",
  "breakfast": "🌅🍽️", "lunch": "☀️🍽️", "dinner": "🌆🍽️", "dessert": "🍰",
  "shower": "🚿", "bath": "🛁", "wash": "🧼", "brush": "🦷", "teeth": "🦷", "hair": "💇",
  "sleep": "😴", "nap": "😴", "rest": "😴", "bed": "🛏️", "awake": "👀", "wake": "⏰",
  "bathroom": "🚽", "toilet": "🚽", "diaper": "👶", "change": "🔄", "clean": "🧹", "dirty": "🧼",
  "clothes": "👕", "dress": "👗", "shirt": "👕", "pants": "👖", "shoes": "👟", "socks": "🧦",
  "laundry": "👕🌀", "dishes": "🍽️🧼", "cook": "👩‍🍳", "shop": "🛒", "drive": "🚗", "work": "💼",
  
  # Basic Verbs (expanded)
  "go": "➡️", "come": "⬅️", "stay": "⏹️", "sit": "🪑", "stand": "🧍", "walk": "🚶", "run": "🏃",
  "give": "🤲", "take": "👋", "get": "🫳", "put": "⬇️", "bring": "➡️", "carry": "🏋️",
  "make": "🛠️", "do": "🔨", "have": "🫴", "use": "🖐️", "need": "🙏", "want": "🤲",
  "try": "🔧", "find": "🔍", "keep": "📥", "leave": "🚪", "open": "📂", "close": "📁",
  "start": "⏯️", "stop": "⏹️", "wait": "⏳", "help": "🆘", "show": "👀", "look": "👀",
  "ask": "🗣️", "tell": "💬", "talk": "💬", "speak": "💬", "listen": "👂", "hear": "👂",
  "read": "📖", "write": "✍️", "draw": "🎨", "play": "🎮", "watch": "📺", "call": "📞",
  "feel": "🤲", "hold": "🤝", "touch": "✋", "hug": "🫂", "love": "❤️", "like": "👍",
  
  # Questions others ask
  "how": "❓", "what": "❓", "where": "❓", "when": "❓", "who": "❓", "why": "❓", "which": "❓",
  "feel": "😊", "feeling": "😊", "pain": "😣", "hurt": "😣", "okay": "👍", "wrong": "❌",
  "need": "🤲", "want": "🤲", "like": "👍", "comfortable": "😌", "ready": "✅",
  "hungry": "🍽️", "thirsty": "😰", "tired": "😴", "cold": "❄️", "hot": "🔥", "sick": "🤒",
  
  # Time references
  "now": "⏰", "today": "📅", "tomorrow": "📅", "yesterday": "📅⬅️", 
  "morning": "🌅", "afternoon": "☀️", "evening": "🌇", "night": "🌙", 
  "later": "⏰", "soon": "⏰", "early": "⏰⬆️", "late": "⏰⬇️",
  "minute": "⏰", "hour": "⏰", "day": "📅", "week": "📅7️⃣", "month": "📅30️⃣", "year": "📅365️⃣",
  
  # Family/visitor communication
  "family": "👪", "visit": "👋", "visitor": "👥", "call": "📞", "phone": "📱", "text": "💬",
  "mom": "👩", "dad": "👨", "mother": "👩", "father": "👨", "wife": "👩", "husband": "👨",
  "son": "👦", "daughter": "👧", "child": "👶", "grandchild": "👶", "baby": "👶",
  "friend": "👫", "neighbor": "🏠👥", "pet": "🐕", "dog": "🐕", "cat": "🐈",
  
  # Location/movement
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
  "book": "📖", "game": "🎮", "music": "🎵", "party": "🎉", "gift": "🎁", "pray": "🙏"
}

phrase_dict = {
  # Question patterns (lemmatized forms)
  "how be you": "❓🫵",
  "what be": "❓",
  "where be": "❓📍",
  "when be": "❓⏰",
  "who be": "❓👤",
  "why be": "❓",
  
  # Negation patterns (lemmatized)
  "do not": "❌",
  "be not": "❌",
  "will not": "❌⏩",
  "can not": "❌",
  
  # Modal patterns (lemmatized)
  "need to": "🙏",
  "want to": "🙏",
  "have to": "📋", 
  "go to": "➡️",
  
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


# test_sentences = [
#   "It's time to take your medicine",
#   "Do you need to use the bathroom?", 
#   "How are you feeling today?",
#   "Your daughter is coming to visit",
#   "Can you drink some water please?",
#   "The doctor wants to see you",
#   "Are you having any pain?",
#   "Let's get you dressed now",
#   "Help is coming, don't worry!",
#   "What would you like to eat?"
# ]

# for sentence in test_sentences:
#   print(sentence)
#   result = convert_to_emojis(sentence)
#   print()
#   print(result)
  


































# ===== 5th Attempt (synonymous word tracking) =====
# --- Preprocessing ---
# Change the synonymus words to the words in the emoji_words dictionary
# def get_best_synonym(word, emoji_dict):
#   synonyms = wordnet.synsets(word)
#   for syn in synonyms:
#     for lemma in syn.lemma_names():
#       if lemma in emoji_dict:
#         return lemma
#   return word  # fallback to original if no match

# def remove_contractions(sentence):
#     return contractions.fix(sentence.lower())

# # --- Main Function ---
# def sentence_to_emoji(sentence):
#   doc = nlp(sentence.lower())
#   lemmatized_words = [token.lemma_ for token in doc]

#   replaced_words = [
#     get_best_synonym(word, emoji_phrases) for word in lemmatized_words
#   ]

#   # Reconstruct lemmatized sentence
#   lemmatized_sentence = " ".join(replaced_words)
#   output = []

#   for phrase in sorted(emoji_phrases, key=len, reverse=True):
#     if phrase in lemmatized_sentence:
#       output.append(emoji_phrases[phrase])
#       lemmatized_sentence = lemmatized_sentence.replace(phrase, "")  # avoid duplicate
      
#   return " ".join(output)



# print(sentence_to_emoji("I want a cold drink and a glass of milk"))
# print(sentence_to_emoji("Shall we drink water or have some hot coffee?"))

# test_sentences = [
#   "I am thirsty and want cold drinks",
#   "Let's have some coffee and tea",
#   "Party with beer and wine tonight",
#   "Morning juice and a glass of milk",
# ]

# for sent in test_sentences:
#   emojis = sentence_to_emoji(sent)
#   print(f"Sentence: {sent}\nEmojis: {emojis}\n")


# ===== 4th Attempt (Lemmatization included) =====
# # Function to lemmatize a phrase
# def lemmatize_phrase(phrase):
#   return " ".join([lemmatizer.lemmatize(w) for w in phrase.split()])

# def sentence_to_emoji(sentence):
#   sentence = sentence.lower()
#   sentence = re.sub(r'[^\w\s]', '', sentence)  # remove punctuation

#   words = sentence.split()
#   output = sentence

#   # Create all possible 2–4 word phrases
#   matched_phrases = {}
#   for n in range(4, 1, -1):  # 4, 3, 2
#     for i in range(len(words) - n + 1):
#       phrase = " ".join(words[i:i+n])
#       lemmatized = lemmatize_phrase(phrase)
#       if lemmatized in emoji_phrases:
#         matched_phrases[phrase] = emoji_phrases[lemmatized]

#   # Replace phrases first (longest ones first)
#   for phrase, emoji in matched_phrases.items():
#     output = output.replace(phrase, emoji)

#   # Lemmatize and replace single words
#   final_words = []
#   for word in output.split():
#     lemma = lemmatizer.lemmatize(word)
#     final_words.append(emoji_words.get(lemma, word))

#   return " ".join(final_words)



# ===== 5th Attempt (Phrase first approach) =====
# def sentence_to_emoji(sentence):
#   # Normalize the sentence
#   sentence = sentence.lower()
  
#   # Handle phrases first
#   for phrase, emoji in emoji_phrases.items():
#     if phrase in sentence:
#       sentence = sentence.replace(phrase, emoji)
      
#   # Lemmatize each word (handles Plurals like 'drinks' -> 'drink')
#   words = sentence.split()
#   translated = []
#   for word in words: 
#     lemma = lemmatizer.lemmatize(word)
#     translated.append(emoji_words.get(lemma, word))
    
#   return " ".join(translated)


# ===== 2nd attempt (words & phrases) ======
# def sentence_to_emoji(sentence):
#   sentence = sentence.lower()
#   output = sentence

#   # Handle phrases first
#   for phrase, emoji in emoji_phrases.items():
#     if phrase in output:
#       output = output.replace(phrase, emoji)

#   # Then replace single words
#   words = output.split()
#   translated = [emoji_words.get(word, word) for word in words]
#   return " ".join(translated)


# ===== 1st attempt (words) =====
# # --- Helper functions ---
# def normalize_word(word):
#   return word.lower()


# def sentence_to_emoji(sentence):
#   words = sentence.split()
#   emojis = []
#   for word in words:
#     norm_word = normalize_word(word)
#     if norm_word in emoji_dict:
#       emojis.append(emoji_dict[norm_word])
#   return ' '.join(emojis)


# # Test sentecnes with beverages focus
# test_sentences = [
#   "I am thirsty and want a cold drink",
#   "Let's have some coffee and tea",
#   "Party with beer and wine tonight",
#   "Morning juice and a glass of milk",
# ]

# for sent in test_sentences:
#   emojis = sentence_to_emoji(sent)
#   print(f"Sentence: {sent}\nEmojis: {emojis}\n")
