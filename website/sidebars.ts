import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Legal",
      items: ["legal/terms-of-service", "legal/privacy-policy"],
    },
    {
      type: "category",
      label: "Games",
      items: [
        "games/how-to-delete-account",
        {
          type: "category",
          label: "Backgammon",
          items: ["games/backgammon/how-to-delete-account"],
        },
      ],
    },
    {
      type: "category",
      label: "Rubik's Cube",
      items: [
        {
          type: "category",
          label: "Beginner Tutorials",
          items: [
            "rubik/tutorials/index",
            "rubik/tutorials/2x2",
            "rubik/tutorials/pyraminx",
            "rubik/tutorials/skewb",
            "rubik/tutorials/4x4",
          ],
        },
        {
          type: "category",
          label: "Advanced 3x3",
          items: [
            "rubik/tutorials/cfop",
            "rubik/tutorials/f2l",
            "rubik/tutorials/oll",
            "rubik/tutorials/pll",
          ],
        },
        {
          type: "category",
          label: "Technique & Speed",
          items: [
            "rubik/tutorials/finger-tricks",
            "rubik/tutorials/speed-tips",
          ],
        },
        {
          type: "category",
          label: "Advanced Puzzles",
          items: [
            "rubik/tutorials/2x2-advanced",
            "rubik/tutorials/4x4-advanced",
            "rubik/tutorials/pyraminx-advanced",
            "rubik/tutorials/skewb-advanced",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
