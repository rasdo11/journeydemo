// JourneySpan design tokens — "High-Integrity Minimalist".
// Authoritative, institutional, structural. White blocks, heavy dark frames,
// sharp geometry, one disciplined accent. Import C anywhere you need a color.
//
// Legacy key names are kept and remapped so existing references keep working.
export const C = {
  ink: "#15171C",      // body text
  bark: "#0B0B0C",     // near-black: dark blocks, headings, structural frames
  border: "#0B0B0C",   // heavy structural container border
  line: "#C4C7CE",     // visible structural hairline / chart grid / dividers
  paper: "#FFFFFF",    // stark white background
  surface: "#FFFFFF",  // white container blocks
  mist: "#F2F3F5",     // light gray fill (tracks, subtle blocks)
  mistDark: "#E6E8EC",
  stone: "#5C616B",    // secondary text / mid gray
  faint: "#9AA0AC",    // tertiary

  accent: "#2A45F5",   // the single sharp accent — active / selected / primary data
  accentSoft: "#ECEEFE", // light accent fill for selected backgrounds

  // legacy aliases, remapped:
  canopy: "#2A45F5",   // was green → now accent (active / positive / "you")
  moss: "#5C616B",     // secondary gray
  leaf: "#2A45F5",     // span fill → accent
  clay: "#0B0B0C",     // was warm accent → near-black structural emphasis
  clayDeep: "#0B0B0C",
  dim: "#C9CCD2",      // dimmed chart lines
  void: "#EFF0F2",     // unmeasured gaps (light gray)
  bare: "#E0E2E6",     // unfilled span segment (light gray)
};

export const fontSans = "'Inter',system-ui,sans-serif";
export const fontMono = "'IBM Plex Mono',ui-monospace,monospace";
