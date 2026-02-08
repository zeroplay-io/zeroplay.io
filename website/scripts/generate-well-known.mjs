import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APPLE_TEAM_ID = "BL5JKRRNXD";

const __dirname = dirname(fileURLToPath(import.meta.url));
const gamesPath = join(__dirname, "..", "src", "data", "games.json");
const outDir = join(__dirname, "..", "static", ".well-known");

const { games } = JSON.parse(readFileSync(gamesPath, "utf-8"));
const gamesWithAppLinks = games.filter((g) => g.appLinks);

// --- apple-app-site-association ---
const details = [];
for (const game of gamesWithAppLinks) {
  if (game.appLinks.ios) {
    details.push({
      appIDs: [`${APPLE_TEAM_ID}.${game.appLinks.ios.bundleId}`],
      components: [
        { "/": `/go/${game.id}` },
        { "/": `/go/${game.id}/*` },
      ],
    });
  }
  if (game.appLinks["ios-china"]) {
    details.push({
      appIDs: [`${APPLE_TEAM_ID}.${game.appLinks["ios-china"].bundleId}`],
      components: [
        { "/": `/go/cn/${game.id}` },
        { "/": `/go/cn/${game.id}/*` },
      ],
    });
  }
}

const aasa = {
  applinks: {
    apps: [],
    details,
  },
};

// --- assetlinks.json ---
const assetlinks = gamesWithAppLinks
  .filter((g) => g.appLinks.android)
  .map((game) => ({
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: game.appLinks.android.packageName,
      sha256_cert_fingerprints: game.appLinks.android.sha256CertFingerprints,
    },
  }));

// --- Write files ---
mkdirSync(outDir, { recursive: true });

writeFileSync(
  join(outDir, "apple-app-site-association"),
  JSON.stringify(aasa, null, 2) + "\n"
);

writeFileSync(
  join(outDir, "assetlinks.json"),
  JSON.stringify(assetlinks, null, 2) + "\n"
);

console.log("Generated .well-known files:");
console.log("  - apple-app-site-association");
console.log("  - assetlinks.json");
