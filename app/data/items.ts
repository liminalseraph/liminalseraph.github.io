export type DetailItem = {
  id: string;
  title: string;
  year: number;
  logoText: string;
  summary: string;
  imageLabel: string;
};

export const projects: DetailItem[] = [
  {
    id: "veil-echo",
    title: "Veil Echo",
    year: 2024,
    logoText: "VE",
    summary: "A kinetic portfolio builder exploring layered motion and silhouette.",
    imageLabel: "Kinetic interface study.",
  },
  {
    id: "gloss-lattice",
    title: "Gloss Lattice",
    year: 2023,
    logoText: "GL",
    summary: "Material-driven UI system with modular grids and bright edges.",
    imageLabel: "Material layout mockups.",
  },
  {
    id: "night-index",
    title: "Night Index",
    year: 2022,
    logoText: "NI",
    summary: "A cataloging tool for nocturne references and ambient cues.",
    imageLabel: "Indexing UI with layered cards.",
  },
];

export const research: DetailItem[] = [
  {
    id: "signal-drift",
    title: "Signal Drift",
    year: 2024,
    logoText: "SD",
    summary: "Research on perceptual thresholds for motion and contrast.",
    imageLabel: "Experiment dashboard.",
  },
  {
    id: "soft-edges",
    title: "Soft Edges",
    year: 2023,
    logoText: "SE",
    summary: "Study of soft UI boundaries and memory in spatial layouts.",
    imageLabel: "Spatial prototypes.",
  },
  {
    id: "quiet-grid",
    title: "Quiet Grid",
    year: 2021,
    logoText: "QG",
    summary: "Exploration of attention in low-contrast environments.",
    imageLabel: "Eye-tracking outputs.",
  },
];

export const blog: DetailItem[] = [
  {
    id: "midnight-annotations",
    title: "Midnight Annotations",
    year: 2024,
    logoText: "MA",
    summary: "Notes on nocturnal interfaces and the calm of low contrast.",
    imageLabel: "Annotated reading stack.",
  },
  {
    id: "archival-shadows",
    title: "Archival Shadows",
    year: 2023,
    logoText: "AS",
    summary: "A reflection on collecting fragments without flattening them.",
    imageLabel: "Archive spreads and scans.",
  },
  {
    id: "soft-signal",
    title: "Soft Signal",
    year: 2022,
    logoText: "SS",
    summary: "Sketches on quiet feedback loops and subtle indicators.",
    imageLabel: "Signal sketches and notes.",
  },
];
