#!/usr/bin/env python3
"""
Import recipes from the Kaggle "food-com-recipes-and-user-interactions" dataset
into the local MongoDB used by the BrokeBites backend.

Usage (PowerShell):
  python ./backend/scripts/import_kaggle_recipes.py --csv ./backend/data/recipes.csv

Requirements:
  pip install pymongo pandas python-dateutil

This script is forgiving about the CSV columns. It will attempt to parse
common columns: `title`/`name`, `ingredients`, `steps`/`directions`, `minutes`, `n_steps`, `tags`, `image_url`.
If an ingredient field contains a JSON list it will be parsed; otherwise common separators
like `|`, `;`, or `,` will be used.

Tags to exclude from imported recipes (hardcoded):
"""
import argparse
import json
import sys
from datetime import datetime

import pandas as pd
from dateutil import parser as dateparser
from pymongo import MongoClient
import re

# Hardcoded tags to remove from recipes
EXCLUDED_TAGS = {
    'time-to-make',
    'course',
    'preparation',
    'metric',
    'cuisine',
    'ingredients',
    'main-ingredient',
    'equipment',
    'occasion'
}


def parse_ingredients(field):
    if pd.isna(field):
        return []
    # If it's already a list
    if isinstance(field, list):
        return [re.sub(r"\s{2,}", " ", str(x).strip()) for x in field if str(x).strip()]
    s = str(field).strip()
    
    # Try JSON parse first
    try:
        parsed = json.loads(s)
        if isinstance(parsed, list):
            return [re.sub(r"\s{2,}", " ", str(x).strip().strip("'\"")) for x in parsed if str(x).strip()]
    except Exception:
        pass
    
    # Try Python literal eval (handles ['item', 'item'])
    try:
        import ast
        parsed = ast.literal_eval(s)
        if isinstance(parsed, list):
            return [re.sub(r"\s{2,}", " ", str(x).strip().strip("'\"")) for x in parsed if str(x).strip()]
    except Exception:
        pass
    
    # Fallback separators
    for sep in ['|', ';', '\\n', '\\r\\n', ',']:
        if sep in s:
            parts = [re.sub(r"\s{2,}", " ", p.strip().strip("'\"")) for p in s.split(sep) if p.strip()]
            if parts:
                return parts
    
    # Single ingredient string
    return [re.sub(r"\s{2,}", " ", s.strip("'\"").strip())] if s else []


def parse_instructions(field):
    if pd.isna(field):
        return []
    if isinstance(field, list):
        return [re.sub(r"\s{2,}", " ", str(x).strip().strip("'\"")) for x in field if str(x).strip()]
    s = str(field).strip()
    
    # Try JSON parse first
    try:
        parsed = json.loads(s)
        if isinstance(parsed, list):
            return [re.sub(r"\s{2,}", " ", str(x).strip().strip("'\"")) for x in parsed if str(x).strip()]
    except Exception:
        pass
    
    # Try Python literal eval (handles ['step', 'step'])
    try:
        import ast
        parsed = ast.literal_eval(s)
        if isinstance(parsed, list):
            return [re.sub(r"\s{2,}", " ", str(x).strip().strip("'\"")) for x in parsed if str(x).strip()]
    except Exception:
        pass
    
    # Split heuristically by lines or numbered steps
    lines = [re.sub(r"\s{2,}", " ", l.strip().strip("'\"")) for l in s.splitlines() if l.strip()]
    if len(lines) > 1:
        return lines
    
    # Fallback split by '.' (naive)
    parts = [re.sub(r"\s{2,}", " ", p.strip().strip("'\"")) for p in s.split('.') if p.strip()]
    return parts


def parse_tags(field):
    if pd.isna(field):
        return []
    if isinstance(field, list):
        return [re.sub(r"\s{2,}", " ", str(x).lower().strip().strip("'\"")) for x in field if str(x).strip()]
    s = str(field).strip()
    
    # Try JSON parse first
    try:
        parsed = json.loads(s)
        if isinstance(parsed, list):
            return [re.sub(r"\s{2,}", " ", str(x).lower().strip().strip("'\"")) for x in parsed if str(x).strip()]
    except Exception:
        pass
    
    # Try Python literal eval (handles ['tag', 'tag'])
    try:
        import ast
        parsed = ast.literal_eval(s)
        if isinstance(parsed, list):
            return [re.sub(r"\s{2,}", " ", str(x).lower().strip().strip("'\"")) for x in parsed if str(x).strip()]
    except Exception:
        pass
    
    # Split by separators
    for sep in ['|', ';', ',']:
        if sep in s:
            parts = [re.sub(r"\s{2,}", " ", p.strip().strip("'\"").lower()) for p in s.split(sep) if p.strip()]
            if parts:
                return parts
    
    # Single tag
    return [re.sub(r"\s{2,}", " ", s.strip("'\"").lower())] if s else []


def map_row_to_recipe(row):
    # Mapping: be permissive, prefer common column names
    title = row.get('title') or row.get('name') or row.get('recipe_name') or ''
    ingredients = []
    # try multiple candidate columns
    for col in ['ingredients', 'ingredient_list', 'ingredients_parsed', 'ingrs']:
        if col in row and not pd.isna(row[col]):
            ingredients = parse_ingredients(row[col])
            break

    if not ingredients:
        # maybe there's a 'components' column
        for col in row.index:
            if 'ingredient' in col.lower() and not pd.isna(row[col]):
                ingredients = parse_ingredients(row[col])
                break

    instructions = []
    for col in ['steps', 'directions', 'instructions', 'method']:
        if col in row and not pd.isna(row[col]):
            instructions = parse_instructions(row[col])
            break

    image_url = None
    for col in ['image', 'image_url', 'photo_url', 'thumbnail']:
        if col in row and not pd.isna(row[col]):
            image_url = row[col]
            break

    # Numeric/time fields
    prep_time = None
    cook_time = None
    total_time = None
    for col in ['minutes', 'total_time', 'total_minutes']:
        if col in row and not pd.isna(row[col]):
            try:
                total_time = int(row[col])
            except Exception:
                try:
                    total_time = int(float(row[col]))
                except Exception:
                    total_time = None
            break

    # Tags
    tags = []
    for col in ['tags', 'cuisine', 'meal', 'category']:
        if col in row and not pd.isna(row[col]):
            tags = parse_tags(row[col])
            if tags:
                break
    
    # Remove excluded tags
    tags = [tag for tag in tags if tag.lower() not in EXCLUDED_TAGS]

    def normalize(text):
        if text is None:
            return text
        return re.sub(r"\s{2,}", " ", str(text).strip())

    recipe = {
        'title': normalize(title),
        'description': normalize(str(row.get('description') or '')[:1000]),
        'image_url': image_url,
        'prep_time_minutes': prep_time,
        'cook_time_minutes': cook_time,
        'servings': None,
        'ingredients': [re.sub(r"\s{2,}", " ", i) for i in ingredients],
        'instructions': [re.sub(r"\s{2,}", " ", ins) for ins in instructions],
        'nutrition': None,
        'tags': [re.sub(r"\s{2,}", " ", t) for t in tags],
        'source': row.get('source') or 'kaggle-food-com',
        'rating': None,
        'review_count': None,
        'is_saved': False,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    return recipe


def import_csv_to_mongo(csv_path, mongo_uri, db_name='brokebites', collection_name='recipes', limit=None):
    print(f"Loading CSV in chunks: {csv_path}")
    print(f"Excluded tags: {EXCLUDED_TAGS}")

    client = MongoClient(mongo_uri)
    db = client[db_name]
    coll = db[collection_name]

    inserted = 0
    row_count = 0
    chunk_size = 1000
    
    # Read CSV in chunks to avoid memory issues
    for df in pd.read_csv(csv_path, low_memory=False, chunksize=chunk_size):
        for idx, row in df.iterrows():
            if limit and row_count >= limit:
                print(f"Reached limit of {limit} rows")
                client.close()
                print(f"Inserted {inserted} documents into {db_name}.{collection_name}")
                return
            
            try:
                recipe_doc = map_row_to_recipe(row)
                # Skip blank title or no ingredients
                if not recipe_doc['title'] or not recipe_doc['ingredients']:
                    row_count += 1
                    continue
                
                coll.insert_one(recipe_doc)
                inserted += 1
                row_count += 1
            except Exception as e:
                print(f"Error inserting row {row_count}: {e}", file=sys.stderr)
                row_count += 1
        
        print(f"  Processed {row_count} rows, inserted {inserted} documents...")

    print(f"Inserted {inserted} documents into {db_name}.{collection_name}")
    client.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--csv', required=True, help='Path to recipes CSV file')
    parser.add_argument('--mongo-uri', default='mongodb://localhost:27017', help='MongoDB URI')
    parser.add_argument('--db', default='brokebites', help='MongoDB database name')
    parser.add_argument('--collection', default='recipes', help='MongoDB collection name')
    parser.add_argument('--limit', type=int, help='Limit number of rows to import (for testing)')
    args = parser.parse_args()

    import_csv_to_mongo(args.csv, args.mongo_uri, db_name=args.db, collection_name=args.collection, limit=args.limit)


if __name__ == '__main__':
    main()
