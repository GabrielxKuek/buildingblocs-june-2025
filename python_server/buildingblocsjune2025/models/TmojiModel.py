import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
import re
import spacy
from contractions import OrderedDict


nlp = spacy.load("en_core_web_sm")

# Ensure that the necessary NLTK resources are downloaded
# nltk.download('wordnet')
# nltk.download('omw-1.4')

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Your emoji dictionary
emoji_words = {
  "water": "💧",
  "drink": "🥤",
  "coffee": "☕",
  "tea": "🍵",
  "juice": "🧃",
  "milk": "🥛",
  "beer": "🍺",
  "wine": "🍷",
  "soda": "🥤",
  "cup": "☕",
  "glass": "🥛",
  "thirsty": "😰",
  "cold": "❄️",
  "hot": "🔥",
  "bottle": "🍾",
  "refresh": "💦",
  "watermelon": "🍉",
  "lemon": "🍋",
  "ice": "🧊",
  "bar": "🍸",
  "party": "🎉",
  "break": "⏸️",
  "morning": "🌅",
  "evening": "🌇",
  "happy": "😄",
  "?": "❓",
  "!": "❗",
  "let's": "🤝",
  
}

emoji_phrases = {
  "cold drink": "❄️🥤",
  "hot coffee": "🔥☕",
  "glass of milk": "🥛",
  "drink water": "💧",
  "bottle of wine": "🍾🍷",
  "let's have": "🤝🍽️",
  "i am": "🙂",
  "i'm": "🙂",
  "i want": "🙏",
  "i don't want": "🙅",
  "cold drink": "❄️🥤",
  "with friends": "👫",
  
  "do": "❓",  
  "be": "❓",  # Covers: is/are/was/were/be/being
  "can": "❓🛠️",
  "will": "❓⏭️",
  "would": "❓🤔",
  "have": "❓✔️",  # Covers have/has/had
  "should": "❓💡",
  
  # WH-questions
  "what": "❓🔍",
  "where": "❓🗺️",
  "when": "❓📅",
  "who": "❓👤",
  "why": "❓🤔",
  "how": "❓🛠️",
  "which": "❓🔎",
  "whose": "❓👤",
  
  # Common combinations (will be built from lemmas)
  "how many": "❓🔢",
  "how much": "❓💰",
  "what time": "❓🕒",
  "what kind": "❓🔎",
  
  # Negation (works with any question)
  "not": "🚫",
  "don't": "🚫",
  "doesn't": "🚫",
  "didn't": "🚫⌛",
  "can't": "🚫🛠️",
  "won't": "🚫⏭️"
}


class TextToEmojiConverter: 
  def __init__(self, emoji_words):
    self.np = spacy.load("en_core_web_sm")
    self.emoji_words = emoji_words
    self.sorted_phrases = sorted(emoji_words.keys(), key=len, reverse=True)  # Sort by length for phrase matching

  def get_best_synonym(self, word, pos_tag=None):
    """Find best synonym with POS tag consideration"""
    if word in self.emoji_words:
      return word
        
    synonyms = wordnet.synsets(word, pos=pos_tag)
    best_matches = []
    
    for syn in synonyms:
      for lemma in syn.lemma_names():
        lemma_clean = lemma.replace('_', ' ')
        if lemma_clean in self.emoji_words:
          # Prioritize by similarity score if available
          best_matches.append((lemma_clean, syn.definition()))
    
    return best_matches[0][0] if best_matches else word

  def preprocess_text(self, text):
    """Clean and preprocess text"""
    text = contractions.fix(text.lower())
    # Remove extra whitespace and special chars that might interfere
    text = ' '.join(text.split())
    return text

  def convert_to_emoji(self, sentence):
    """Convert sentence to emojis with improved logic"""
    sentence = self.preprocess_text(sentence)
    doc = self.nlp(sentence)
    
    # Create a mapping of original positions to preserve context
    processed_tokens = []
    for token in doc:
      if not token.is_stop and not token.is_punct:
        # Map spaCy POS to WordNet POS
        pos_map = {'NOUN': wordnet.NOUN, 'VERB': wordnet.VERB, 
                  'ADJ': wordnet.ADJ, 'ADV': wordnet.ADV}
        wordnet_pos = pos_map.get(token.pos_, None)
        
        synonym = self.get_best_synonym(token.lemma_, wordnet_pos)
        processed_tokens.append(synonym)
      else:
        processed_tokens.append(token.lemma_)
    
    # Reconstruct with better phrase matching
    processed_text = ' '.join(processed_tokens)
    matched_emojis = []
    used_positions = set()
    
    # Multi-pass phrase matching to avoid conflicts
    for phrase in self.sorted_phrases:
      start = 0
      while True:
        pos = processed_text.find(phrase, start)
        if pos == -1:
          break
            
        # Check if this position overlaps with already used positions
        phrase_positions = set(range(pos, pos + len(phrase)))
        if not phrase_positions.intersection(used_positions):
          matched_emojis.append((pos, self.emoji_words[phrase]))
          used_positions.update(phrase_positions)
        
        start = pos + 1
    
    # Sort by position and return emojis
    matched_emojis.sort(key=lambda x: x[0])
    return ' '.join([emoji for _, emoji in matched_emojis])

converter = TextToEmojiConverter(emoji_words)
result = converter.convert_to_emoji("I love happy dogs")
print(result)













































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
