/**
 * This implementation is adapted from radix-ui Presence component.
 * Special thanks to Radix UI team!
 * https://github.com/radix-ui/primitives/blob/main/packages/react/presence/src/Presence.tsx
 */

import { createMachine } from "./machine"

export type PresenceState = "open" | "closed"
export type Presence = ReturnType<typeof createPresence>

const getAnimationName = (styles?: CSSStyleDeclaration) => styles?.animationName || "none"

export const createPresence = (present: boolean, node: HTMLElement) => {
  let styles = getComputedStyle(node)
  let previousPresent = present
  let previousAnimationName = "none"

  const machine = createMachine(
    present ? "open" : "closed",
    {
      open: {
        CLOSE: "closed",
        ANIMATION_OUT: "animated"
      },
      animated: {
        OPEN: "open",
        ANIMATION_END: "closed"
      },
      closed: {
        OPEN: "open"
      }
    },
    {
      open: () => {
        node.hidden = false
      },
      animated: () => {
        node.hidden = false
      },
      closed: () => {
        // store the styles before hide the element
        styles = getComputedStyle(node)
        node.hidden = true
        removeEventListeners()
      },
      default: (state) => {
        // store the animation name when opened
        const currentAnimationName = getAnimationName(styles)
        previousAnimationName = state === "open" ? currentAnimationName : "none"
      }
    }
  )

  const addEventListeners = () => {
    node.addEventListener("animationstart", handleAnimationStart);
    node.addEventListener("animationcancel", handleAnimationEnd);
    node.addEventListener("animationend", handleAnimationEnd);
  }

  const removeEventListeners = () => {
    node.removeEventListener("animationstart", handleAnimationStart);
    node.removeEventListener("animationcancel", handleAnimationEnd);
    node.removeEventListener("animationend", handleAnimationEnd);
  }

  const handleAnimationStart = (event: AnimationEvent) => {
    if (event.target === node) {
      previousAnimationName = getAnimationName(styles);
    }
  };

  const handleAnimationEnd = (event: AnimationEvent) => {
    const currentAnimationName = getAnimationName(styles);
    const isCurrentAnimation = currentAnimationName.includes(event.animationName);

    if (event.target === node && isCurrentAnimation) {
      machine.send("ANIMATION_END");
    }
  }

  // Public API

  const open = () => {
    if (previousPresent) return

    machine.send("OPEN")

    previousPresent = true
  }

  const close = () => {
    if (!previousPresent) return

    addEventListeners()

    const currentAnimationName = getAnimationName(styles)
    const isAnimating = previousAnimationName !== currentAnimationName

    if (previousPresent && isAnimating) {
      machine.send("ANIMATION_OUT")
    } else {
      machine.send("CLOSE")
    }

    previousPresent = false
  }

  const cleanup = removeEventListeners

  return { open, close, cleanup }
}

