// JourneySpan design tokens: millennial institutional.
// Warm editorial paper, heavy near-black frames, sharp geometry, and one
// prostate-cancer-ribbon blue accent inspired by contemporary venture/finance brands.
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

  accent: "#69B3E7",   // prostate-cancer-ribbon blue: active / selected / primary data
  accentInk: "#123A54",
  accentSoft: "#E8F5FC", // light ribbon-blue fill for selected backgrounds
  cream: "#FBFAF2",
  blush: "#FFF0E7",
  lilac: "#EEE8FF",
  sky: "#E7F2FF",
  highlight: "#B7FF2A", // optional highlighter, used sparingly
  night2: "#111A20",

  // legacy aliases, remapped:
  canopy: "#69B3E7",   // active / positive / "you"
  moss: "#68685E",     // secondary gray
  leaf: "#69B3E7",     // span fill uses accent
  clay: "#0D0D08",     // near-black structural emphasis
  clayDeep: "#0D0D08",
  dim: "#C9C6BA",      // dimmed chart lines
  void: "#EFEEE5",     // unmeasured gaps
  bare: "#DDDACE",     // unfilled span segment
};

export const fontSans = "'Inter',system-ui,sans-serif";
export const fontMono = "'IBM Plex Mono',ui-monospace,monospace";
