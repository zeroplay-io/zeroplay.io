import React from "react";
import OriginalLayout from "@theme-original/Layout";
import { useLocation } from "@docusaurus/router";

export default function LayoutWrapper(
  props: React.ComponentProps<typeof OriginalLayout>,
) {
  const location = useLocation();
  const search =
    location?.search ??
    (typeof window !== "undefined" ? window.location.search : "");
  const params = new URLSearchParams(search ?? "");
  const isCleanMode = params.get("mode")?.toLowerCase() === "clean";

  const mergedProps: React.ComponentProps<typeof OriginalLayout> = isCleanMode
    ? {
        ...props,
        noNavbar: true,
        noFooter: true,
      }
    : props;

  return <OriginalLayout {...mergedProps} />;
}
