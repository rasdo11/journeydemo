// JourneySpan design tokens — millennial institutional.
// Warm editorial paper, heavy near-black frames, sharp geometry, and one
// high-energy acid-lime accent inspired by contemporary venture/finance brands.
//
// Legacy key names are kept and remapped so existing references keep working.
export const C = {
  ink: "#14140F",      // body text
  bark: "#0D0D08",     // near-black: dark blocks, headings, structural frames
  border: "#0D0D08",   // heavy structural container border
  line: "#C4C2B8",     // visible structural hairline / chart grid / dividers
  paper: "#FBFAF2",    // warm editorial background
  surface: "#FFFFFF",  // white container blocks
  mist: "#F1F0E8",     // warm light fill (tracks, subtle blocks)
  mistDark: "#E4E2D7",
  stone: "#68685E",    // secondary text / mid gray
  faint: "#9A9A8F",    // tertiary

  accent: "#B7FF2A",   // acid-lime accent — active / selected / primary data
  accentInk: "#203A00",
  accentSoft: "#F1FFD8", // light accent fill for selected backgrounds
  cream: "#FBFAF2",
  blush: "#FFF0E7",
  lilac: "#EEE8FF",
  sky: "#E7F2FF",
  night2: "#1B1B12",

  // legacy aliases, remapped:
  canopy: "#B7FF2A",   // active / positive / "you"
  moss: "#68685E",     // secondary gray
  leaf: "#B7FF2A",     // span fill → accent
  clay: "#0D0D08",     // near-black structural emphasis
  clayDeep: "#0D0D08",
  dim: "#C9C6BA",      // dimmed chart lines
  void: "#EFEEE5",     // unmeasured gaps
  bare: "#DDDACE",     // unfilled span segment
};

export const fontSans = "'Inter',system-ui,sans-serif";
export const fontMono = "'IBM Plex Mono',ui-monospace,monospace";
