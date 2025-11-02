import gamesData from "@site/src/data/games.json";

export interface GameTranslations {
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface GameData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  banner: string;
  deeplink?: string;
  videoUrl?: string;
  posterUrl?: string;
  screenshots?: string[];
  orientation?: string;
  stores?: {
    appStore?: string;
    googlePlay?: string;
    h5?: string;
  };
  socialMedia?: {
    enabled: boolean;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  translations?: Record<string, GameTranslations>;
}

/**
 * Get localized game data based on current locale
 */
export function getLocalizedGames(locale: string = "en"): GameData[] {
  return gamesData.games.map((game: any) => {
    // If locale is English or no translations available, return original
    if (locale === "en" || !game.translations || !game.translations[locale]) {
      return game as GameData;
    }

    // Merge translations with original data
    const translations = game.translations[locale];
    return {
      ...game,
      title: translations.title || game.title,
      subtitle: translations.subtitle || game.subtitle,
      description: translations.description || game.description,
    } as GameData;
  });
}

/**
 * Get a single localized game by ID
 */
export function getLocalizedGame(gameId: string, locale: string = "en"): GameData | undefined {
  const games = getLocalizedGames(locale);
  return games.find((game) => game.id === gameId);
}
