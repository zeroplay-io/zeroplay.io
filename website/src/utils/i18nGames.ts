import gamesData from "@site/src/data/games.json";
import backgammonTranslations from "@site/src/data/translations/backgammon.json";
import solitaireTranslations from "@site/src/data/translations/solitaire.json";
import rubikTranslations from "@site/src/data/translations/rubik.json";
import sudokuTranslations from "@site/src/data/translations/sudoku.json";
import minesweeperTranslations from "@site/src/data/translations/minesweeper.json";

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
  released: boolean;
}

// Map game IDs to their translation data
const translationsMap: Record<string, Record<string, GameTranslations>> = {
  backgammon: backgammonTranslations,
  solitaire: solitaireTranslations,
  rubik: rubikTranslations,
  sudoku: sudokuTranslations,
  minesweeper: minesweeperTranslations,
};

/**
 * Get localized game data based on current locale
 */
export function getLocalizedGames(locale: string = "en"): GameData[] {
  return gamesData.games.map((game: any) => {
    const translations = translationsMap[game.id] || {};
    const localeTranslation = translations[locale] || translations["en"] || {};
    const enTranslation = translations["en"] || {};

    return {
      ...game,
      title: localeTranslation.title || enTranslation.title || game.id,
      subtitle: localeTranslation.subtitle || enTranslation.subtitle || "",
      description: localeTranslation.description || enTranslation.description || "",
    } as GameData;
  });
}

/**
 * Get released games only
 */
export function getReleasedGames(locale: string = "en"): GameData[] {
  return getLocalizedGames(locale).filter((game) => game.released);
}

/**
 * Get a single localized game by ID
 */
export function getLocalizedGame(gameId: string, locale: string = "en"): GameData | undefined {
  const games = getLocalizedGames(locale);
  return games.find((game) => game.id === gameId);
}
