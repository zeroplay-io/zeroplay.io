import React from "react";
import OriginalNavbar from "@theme-original/Navbar";
import { useLocation } from "@docusaurus/router";

export default function NavbarWrapper(props: React.ComponentProps<typeof OriginalNavbar>) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isCleanMode = searchParams.get("mode")?.toLowerCase() === "clean";

  if (isCleanMode) {
    // Return an invisible placeholder navbar instead of null to prevent
    // "Cannot read properties of null (reading 'clientHeight')" error
    // in useTOCHighlight hook
    return <div className="navbar" style={{ display: 'none', height: 0 }} />;
  }

  return <OriginalNavbar {...props} />;
}
