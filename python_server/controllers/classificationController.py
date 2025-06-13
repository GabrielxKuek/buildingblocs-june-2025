from gensim.models import KeyedVectors
import gensim.downloader as api
import numpy as np
from flask import Flask, jsonify
import urllib.request
import os

np.random.seed(42)
app = Flask(__name__)

# Load model globally
wv = None

# helper functions
def download_word2vec_model():
    url = "https://figshare.com/ndownloader/files/10798046"
    filename = "GoogleNews-vectors-negative300.bin.gz"
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, '..', 'data') # store download in ../data/<filename>
    os.makedirs(data_dir, exist_ok=True)
    
    filepath = os.path.join(data_dir, filename)
    
    if not os.path.exists(filepath):
        print(f"Downloading Word2Vec model to {filepath}...")
        print("This may take a while (file is ~1.5GB)...")
        urllib.request.urlretrieve(url, filepath)
        print("Download complete!")
    else:
        print(f"Model already exists at {filepath}")
    
    return filepath

def load_word_vectors():
    global wv
    if wv is None:
        print("Loading word2vec model..")
        model_path = download_word2vec_model()
        print("modelpath is", model_path)
        # wv = KeyedVectors.load_word2vec_format(model_path, binary=True)
        wv = api.load("glove-wiki-gigaword-50")
        print("Model loaded successfully")
    return wv

def get_phrase_vector(phrase, model):
    """Get average vector for a phrase (handles both single words and multi-word phrases)"""
    tokens = phrase.lower().split()
    valid_vectors = [model[word] for word in tokens if word in model.key_to_index]
    
    if not valid_vectors:
        return None
    
    return np.mean(valid_vectors, axis=0)

def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two vectors"""
    if vec1 is None or vec2 is None:
        return -1.0
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def phrase_similarity(phrase1, phrase2, model):
    """Calculate similarity between two phrases"""
    vec1 = get_phrase_vector(phrase1, model)
    vec2 = get_phrase_vector(phrase2, model)
    return cosine_similarity(vec1, vec2)

def average_phrase_similarity(input_phrase, phrase_list, model):
    """Calculate average similarity between input phrase and a list of phrases"""
    input_vec = get_phrase_vector(input_phrase, model)
    if input_vec is None:
        return -1.0
    
    similarities = []
    for phrase in phrase_list:
        phrase_vec = get_phrase_vector(phrase, model)
        if phrase_vec is not None:
            sim = cosine_similarity(input_vec, phrase_vec)
            similarities.append(sim)
    
    if not similarities:
        return -1.0
    
    return np.mean(similarities)

def find_best_category_match(input_phrase):
    wv_model = load_word_vectors()
    
    # Check if any tokens in the phrase exist in vocabulary
    input_vec = get_phrase_vector(input_phrase, wv_model)
    if input_vec is None:
        return {
            "main_category": None,
            "subcategory": None,
            "item": None,
            "all_subcategories": [],
            "similarity": -1.0
        }

    categories = {
        "Services": {
            "Personal Care": ["bathing", "toilet", "dressing"],
            "Meal Help": ["eating", "feeding"],
            "Emergency": ["call help", "nurse"]
        },
        "Drinks": {
            "Cold Drinks": ["coke"],
            "Hot Drinks": ["coffee", "tea"],
            "Juices": ["apple juice", "orange juice"],
            "Still Drinks": ["water", "milk"]
        },
        "Food": {
            "Staples": ["rice", "bread", "noodles"],
            "Fruits & Vegetables": ["apple", "banana", "carrot"],
            "Snacks": ["biscuit", "chips", "yogurt"]
        },
        "Objects": {
            "Toiletries": ["toothbrush", "soap"],
            "Kitchen Items": ["cup", "spoon"],
            "Devices": ["TV remote", "phone"]
        },
        "Clothing": {
            "Tops": ["shirt", "blouse"],
            "Bottoms": ["pants", "skirt"],
            "Footwear": ["shoes", "socks"]
        },
        "Medical": {
            "Medication": ["pills", "insulin"],
            "Mobility": ["wheelchair", "walking stick"],
            "Bandages": ["plaster", "gauze"]
        }
    }

    best_match = {
        "main_category": None,
        "subcategory": None,
        "item": None,
        "all_subcategories": [],
        "similarity": -1.0
    }

    # Step 1: Find best main category by comparing to all example items
    for main_category, subcats in categories.items():
        all_items = [item for sublist in subcats.values() for item in sublist]
        sim = average_phrase_similarity(input_phrase, all_items, wv_model)
        print(f"{main_category} vs '{input_phrase}': {sim}")
        if sim > best_match["similarity"]:
            best_match["main_category"] = main_category
            best_match["similarity"] = float(sim)

    if best_match["main_category"] is None:
        return best_match

    best_match["all_subcategories"] = list(categories[best_match["main_category"]].keys())
    best_match["similarity"] = -1.0  # Reset for subcategory/item search

    # Step 2: Find best subcategory and most similar item
    for subcategory, items in categories[best_match["main_category"]].items():
        sim = average_phrase_similarity(input_phrase, items, wv_model)
        print(f"{subcategory} vs '{input_phrase}': {sim}")
        if sim > best_match["similarity"]:
            best_match["subcategory"] = subcategory
            best_match["similarity"] = float(sim)

        # Find the most similar individual item
        for item in items:
            item_sim = phrase_similarity(input_phrase, item, wv_model)
            if item_sim > best_match["similarity"]:
                best_match["subcategory"] = subcategory
                best_match["item"] = item
                best_match["similarity"] = float(item_sim)

    return best_match

# business functions
def match_category(phrase):
    try:        
        result = find_best_category_match(phrase)

        if result["main_category"] is None:
            return jsonify({
                "success": False,
                "message": f"No match found for '{phrase}' - phrase may not be in vocabulary",
                "phrase": phrase
            }), 404

        return jsonify({
            "success": True,
            "phrase": phrase,
            "main_category": result["main_category"],
            "best_subcategory": result["subcategory"],
            "all_subcategories": result["all_subcategories"],
            "most_similar_item": result["item"],
            "similarity_score": round(result["similarity"], 4)
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error processing phrase '{phrase}': {str(e)}",
            "phrase": phrase
        }), 500

def list_categories():
    categories = {
        "Services": ["Personal Care", "Meal Help", "Emergency"],
        "Food": ["Staples", "Fruits & Vegetables", "Snacks"],
        "Drinks": ["Cold Drinks", "Hot Drinks", "Juices", "Still Drinks"],
        "Objects": ["Toiletries", "Kitchen Items", "Devices"],
        "Clothing": ["Tops", "Bottoms", "Footwear"],
        "Medical": ["Medication", "Mobility", "Bandages"]
    }

    return jsonify({
        "success": True,
        "categories": categories,
        "total_main_categories": len(categories),
        "total_subcategories": sum(len(subs) for subs in categories.values())
    })