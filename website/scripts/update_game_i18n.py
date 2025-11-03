#!/usr/bin/env python3
"""
Update game translations from metadata CSV file.

Usage:
    python3 update_game_i18n.py <game_id> <csv_path>

Example:
    python3 update_game_i18n.py solitaire ../../solitaire/docs/metadata.csv
    python3 update_game_i18n.py backgammon ../../backgammon/docs/metadata.csv
"""
import csv
import json
import sys
import os
from pathlib import Path

# Locale mapping from Apple to our i18n codes
LOCALE_MAPPING = {
    'ar': 'ar',
    'ca': 'ca',
    'hr': 'hr',
    'cs': 'cs',
    'da': 'da',
    'nl-NL': 'nl',
    'en-AU': 'en',
    'en-CA': 'en',
    'en-GB': 'en',
    'en-US': 'en',
    'fi': 'fi',
    'fr-FR': 'fr',
    'fr-CA': 'fr',
    'de-DE': 'de',
    'el': 'el',
    'he': 'he',
    'hi': 'hi',
    'hu': 'hu',
    'id': 'id',
    'it': 'it',
    'ja': 'ja',
    'ko': 'ko',
    'ms': 'ms',
    'no': 'no',
    'pl': 'pl',
    'pt-BR': 'pt-BR',
    'pt-PT': 'pt',
    'ro': 'ro',
    'ru': 'ru',
    'sk': 'sk',
    'es-MX': 'es',
    'es-ES': 'es',
    'sv': 'sv',
    'th': 'th',
    'tr': 'tr',
    'uk': 'uk',
    'vi': 'vi',
    'zh-Hans': 'zh-Hans',
    'zh-Hant': 'zh-Hant',
}

def parse_csv(filename):
    """Parse CSV and return dict of locale -> {title, subtitle, description}"""
    translations = {}

    if not os.path.exists(filename):
        print(f"❌ Error: CSV file not found: {filename}")
        sys.exit(1)

    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            apple_locale = row['Locale']
            our_locale = LOCALE_MAPPING.get(apple_locale)

            if our_locale:
                translations[our_locale] = {
                    'title': row['App Name'].strip(),
                    'subtitle': row['Subtitle'].strip(),
                    'description': row['Description'].strip()
                }

    return translations

def update_game(game_id, csv_path, games_json_path='src/data/games.json'):
    """Update game translations in games.json"""

    # Parse CSV file
    print(f"📖 Parsing {csv_path}...")
    translations = parse_csv(csv_path)

    if not translations:
        print(f"❌ Error: No valid translations found in {csv_path}")
        sys.exit(1)

    # Read games.json
    print(f"📖 Reading {games_json_path}...")
    if not os.path.exists(games_json_path):
        print(f"❌ Error: games.json not found at {games_json_path}")
        sys.exit(1)

    with open(games_json_path, 'r', encoding='utf-8') as f:
        games_data = json.load(f)

    # Find and update the game
    game_found = False
    for game in games_data['games']:
        if game['id'] == game_id:
            game_found = True
            print(f"✏️  Updating {game_id} with {len(translations)} translations...")

            # Update English fields
            if 'en' in translations:
                game['title'] = translations['en']['title']
                game['subtitle'] = translations['en']['subtitle']
                game['description'] = translations['en']['description']

            # Update translations
            game['translations'] = {}
            for locale, trans in translations.items():
                if locale != 'en':  # Don't include English in translations
                    game['translations'][locale] = trans

            break

    if not game_found:
        print(f"❌ Error: Game with id '{game_id}' not found in games.json")
        print(f"   Available games: {', '.join([g['id'] for g in games_data['games']])}")
        sys.exit(1)

    # Write back to games.json
    print(f"💾 Writing updated {games_json_path}...")
    with open(games_json_path, 'w', encoding='utf-8') as f:
        json.dump(games_data, f, ensure_ascii=False, indent='\t')

    print(f"✅ Done! Updated {game_id} with {len(translations)} languages")
    print(f"   Languages: {', '.join(sorted(translations.keys()))}")

def main():
    if len(sys.argv) != 3:
        print(__doc__)
        print(f"\n❌ Error: Invalid number of arguments")
        print(f"   Usage: {sys.argv[0]} <game_id> <csv_path>")
        sys.exit(1)

    game_id = sys.argv[1]
    csv_path = sys.argv[2]

    print(f"🎮 Updating game: {game_id}")
    print(f"📄 CSV source: {csv_path}")
    print()

    update_game(game_id, csv_path)

if __name__ == '__main__':
    main()
