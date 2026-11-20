import { createPortal } from "react-dom";

/**
 * Renders children straight into <body>, so full-screen overlays (modals) are
 * never trapped inside an animated / transformed page wrapper. This is what
 * makes the backdrop cover the entire viewport edge to edge.
 */
function Portal({ children }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export default Portal;
