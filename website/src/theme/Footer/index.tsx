import React from "react";
import OriginalFooter from "@theme-original/Footer";
import { useLocation } from "@docusaurus/router";

export default function FooterWrapper(props: React.ComponentProps<typeof OriginalFooter>) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isCleanMode = searchParams.get("mode")?.toLowerCase() === "clean";

  if (isCleanMode) {
    return null;
  }

  return <OriginalFooter {...props} />;
}
