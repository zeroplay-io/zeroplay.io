#!/usr/bin/env python3
"""
Verify that all translation files are in place for all languages
"""
import os
from pathlib import Path

# All supported languages (excluding English and zh-Hans which we already have)
LANGUAGES = [
    'ar', 'cs', 'da', 'de', 'es', 'fa', 'fi', 'fil', 'fr', 'he', 'hi', 'hu',
    'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt', 'pt-BR', 'ro', 'ru',
    'sv', 'th', 'tr', 'uk', 'vi', 'zh-Hant'
]

# Add zh-Hans to verify
ALL_LANGUAGES = ['zh-Hans'] + LANGUAGES

def check_file(path):
    """Check if file exists and return status"""
    return '✓' if Path(path).exists() else '✗'

def main():
    print("Verifying translation completeness for all languages...")
    print(f"Total languages to verify: {len(ALL_LANGUAGES)}\n")

    all_complete = True
    summary = {
        'code.json': 0,
        'navbar.json': 0,
        'footer.json': 0,
        'docs': 0
    }

    for locale in ALL_LANGUAGES:
        print(f"\nChecking {locale}:")

        # Check code.json
        code_path = f'i18n/{locale}/code.json'
        code_status = check_file(code_path)
        print(f"  {code_status} {code_path}")
        if code_status == '✓':
            summary['code.json'] += 1
        else:
            all_complete = False

        # Check navbar.json
        navbar_path = f'i18n/{locale}/docusaurus-theme-classic/navbar.json'
        navbar_status = check_file(navbar_path)
        print(f"  {navbar_status} {navbar_path}")
        if navbar_status == '✓':
            summary['navbar.json'] += 1
        else:
            all_complete = False

        # Check footer.json
        footer_path = f'i18n/{locale}/docusaurus-theme-classic/footer.json'
        footer_status = check_file(footer_path)
        print(f"  {footer_status} {footer_path}")
        if footer_status == '✓':
            summary['footer.json'] += 1
        else:
            all_complete = False

        # Check docs
        docs_base = f'i18n/{locale}/docusaurus-plugin-content-docs/current'
        required_docs = [
            f'{docs_base}/legal/terms-of-service.md',
            f'{docs_base}/legal/privacy-policy.md',
            f'{docs_base}/games/how-to-delete-account.md',
            f'{docs_base}/games/backgammon/how-to-delete-account.md'
        ]

        docs_complete = True
        for doc in required_docs:
            doc_status = check_file(doc)
            if doc_status != '✓':
                docs_complete = False
                all_complete = False

        if docs_complete:
            print(f"  ✓ All documentation files present")
            summary['docs'] += 1
        else:
            print(f"  ✗ Some documentation files missing")

    # Print summary
    print(f"\n{'='*60}")
    print("Summary:")
    print(f"{'='*60}")
    print(f"Languages with code.json:   {summary['code.json']}/{len(ALL_LANGUAGES)}")
    print(f"Languages with navbar.json: {summary['navbar.json']}/{len(ALL_LANGUAGES)}")
    print(f"Languages with footer.json: {summary['footer.json']}/{len(ALL_LANGUAGES)}")
    print(f"Languages with all docs:    {summary['docs']}/{len(ALL_LANGUAGES)}")

    if all_complete:
        print(f"\n✅ All translation files are in place!")
    else:
        print(f"\n⚠️  Some translation files are missing")

    return 0 if all_complete else 1

if __name__ == '__main__':
    exit(main())
