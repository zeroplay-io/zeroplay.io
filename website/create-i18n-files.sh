#!/bin/bash

# All locales except en and zh-Hans (which we already have)
LOCALES=("zh-Hant" "ja" "ko" "es" "fr" "de" "it" "pt" "pt-BR" "ru" "ar" "tr" "th" "vi" "id" "ms" "fil" "hi" "nl" "pl" "sv" "no" "da" "fi" "he" "fa" "uk" "ro" "cs" "hu")

for locale in "${LOCALES[@]}"; do
  echo "Creating translation files for $locale..."

  # Create directories
  mkdir -p "i18n/$locale/docusaurus-theme-classic"
  mkdir -p "i18n/$locale/docusaurus-plugin-content-docs/current"

  # Copy and modify code.json from zh-Hans as template (keep English values for now)
  if [ ! -f "i18n/$locale/code.json" ]; then
    cat > "i18n/$locale/code.json" << 'EOF'
{
  "homepage.hero.title": {
    "message": "Start from <b>Zero</b>,<b>Play</b> to Infinite!",
    "description": "Home page hero title, can contain simple html tags"
  },
  "homepage.games.title": {
    "message": "Our Games",
    "description": "Title for games section on homepage"
  },
  "game.button.get": {
    "message": "Get",
    "description": "Get/Download button text on game cards"
  }
}
EOF
  fi

  # Create navbar.json
  if [ ! -f "i18n/$locale/docusaurus-theme-classic/navbar.json" ]; then
    cat > "i18n/$locale/docusaurus-theme-classic/navbar.json" << 'EOF'
{
  "title": {
    "message": "ZeroPlay",
    "description": "The title in the navbar"
  },
  "item.label.Games": {
    "message": "Games",
    "description": "Navbar item with label Games"
  },
  "item.label.Docs": {
    "message": "Docs",
    "description": "Navbar item with label Docs"
  }
}
EOF
  fi

  # Create footer.json
  if [ ! -f "i18n/$locale/docusaurus-theme-classic/footer.json" ]; then
    cat > "i18n/$locale/docusaurus-theme-classic/footer.json" << 'EOF'
{
  "link.item.label.Terms of Service": {
    "message": "Terms of Service",
    "description": "The label of footer link with label=Terms of Service"
  },
  "link.item.label.Privacy Policy": {
    "message": "Privacy Policy",
    "description": "The label of footer link with label=Privacy Policy"
  },
  "copyright": {
    "message": "Copyright © 2025 ZeroPlay Ltd. (成都零游网络科技有限公司)",
    "description": "The footer copyright"
  }
}
EOF
  fi

done

echo "Done! Created translation files for all locales."
