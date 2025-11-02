#!/usr/bin/env python3
import csv
import json
import sys

# Locale mapping from Apple to our i18n codes
LOCALE_MAPPING = {
    'ar-SA': 'ar',
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

def main():
    # Parse both CSV files
    print("Parsing backgammon_metadata.csv...")
    backgammon_translations = parse_csv('../backgammon_metadata.csv')

    print("Parsing solitaire_metadata.csv...")
    solitaire_translations = parse_csv('../solitaire_metadata.csv')

    # Read games.json
    print("Reading games.json...")
    with open('src/data/games.json', 'r', encoding='utf-8') as f:
        games_data = json.load(f)

    # Update games
    for game in games_data['games']:
        if game['id'] == 'backgammon':
            print(f"Updating backgammon with {len(backgammon_translations)} translations...")
            # Update English fields from en-US
            if 'en' in backgammon_translations:
                game['title'] = backgammon_translations['en']['title']
                game['subtitle'] = backgammon_translations['en']['subtitle']
                game['description'] = backgammon_translations['en']['description']

            # Update translations
            game['translations'] = {}
            for locale, trans in backgammon_translations.items():
                if locale != 'en':  # Don't include English in translations
                    game['translations'][locale] = trans

        elif game['id'] == 'solitaire':
            print(f"Updating solitaire with {len(solitaire_translations)} translations...")
            # Update English fields from en-US
            if 'en' in solitaire_translations:
                game['title'] = solitaire_translations['en']['title']
                game['subtitle'] = solitaire_translations['en']['subtitle']
                game['description'] = solitaire_translations['en']['description']

            # Update translations
            game['translations'] = {}
            for locale, trans in solitaire_translations.items():
                if locale != 'en':  # Don't include English in translations
                    game['translations'][locale] = trans

    # Write back to games.json
    print("Writing updated games.json...")
    with open('src/data/games.json', 'w', encoding='utf-8') as f:
        json.dump(games_data, f, ensure_ascii=False, indent='\t')

    print("✅ Done! Updated games.json with all translations")
    print(f"   - Backgammon: {len(backgammon_translations)} languages")
    print(f"   - Solitaire: {len(solitaire_translations)} languages")

if __name__ == '__main__':
    main()
