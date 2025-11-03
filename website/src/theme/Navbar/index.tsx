import React from "react";
import OriginalNavbar from "@theme-original/Navbar";
import { useLocation } from "@docusaurus/router";

export default function NavbarWrapper(props: React.ComponentProps<typeof OriginalNavbar>) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isCleanMode = searchParams.get("mode")?.toLowerCase() === "clean";

  if (isCleanMode) {
    return null;
  }

  return <OriginalNavbar {...props} />;
}
