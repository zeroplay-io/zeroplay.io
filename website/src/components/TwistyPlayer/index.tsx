import React, { useEffect, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import styles from "./styles.module.css";

interface TwistyPlayerProps {
  alg?: string;
  setupAlg?: string;
  puzzle?: string;
  stickering?: string;
  hintFacelets?: "floating" | "none";
  controlPanel?: "none";
  background?: "checkered" | "none";
  visualization?: "3D" | "2D";
}

const CDN_URL = "https://cdn.cubing.net/v0/js/cubing/twisty";

let twistyModulePromise: Promise<any> | null = null;

function loadTwistyModule(): Promise<any> {
  if (!twistyModulePromise) {
    const dynamicImport = new Function("url", "return import(url)");
    twistyModulePromise = dynamicImport(CDN_URL);
  }
  return twistyModulePromise;
}

function TwistyPlayerInner(props: TwistyPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const module = await loadTwistyModule();
      const TwistyPlayerClass = module.TwistyPlayer;
      if (cancelled || !containerRef.current) return;

      containerRef.current.innerHTML = "";

      const config: Record<string, any> = {
        puzzle: props.puzzle || "3x3x3",
        alg: props.alg || "",
        experimentalSetupAlg: props.setupAlg || "",
        hintFacelets: props.hintFacelets || "floating",
        background: props.background || "none",
        visualization: props.visualization || "3D",
      };
      // controlPanel 只在明确传 "none" 时设置
      if (props.controlPanel === "none") {
        config.controlPanel = "none";
      }
      const player = new TwistyPlayerClass(config);

      if (props.stickering) {
        player.experimentalStickering = props.stickering;
      }

      // 让 twisty-player 填满外层容器，由容器控制尺寸
      player.style.display = "block";
      player.style.width = "100%";
      player.style.height = "100%";

      containerRef.current.appendChild(player);
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [
    props.alg,
    props.setupAlg,
    props.puzzle,
    props.stickering,
    props.hintFacelets,
    props.controlPanel,
    props.background,
    props.visualization,
  ]);

  return <div ref={containerRef} className={styles.playerContainer} />;
}

export default function TwistyPlayer(props: TwistyPlayerProps) {
  return (
    <BrowserOnly fallback={<div className={styles.placeholder}>Loading cube...</div>}>
      {() => <TwistyPlayerInner {...props} />}
    </BrowserOnly>
  );
}
