export type StylePreset = {
  id: "cute" | "anime" | "soft" | "real";
  name: string;
  description: string;
  img: string;
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "cute",
    name: "Cute",
    description: "Pastel y suave",
    img: "/styles/cute.jpg",
  },
  {
    id: "anime",
    name: "Anime",
    description: "Vibrante y detallado",
    img: "/styles/anime.jpg",
  },
  {
    id: "soft",
    name: "Soft Paint",
    description: "Pinceladas delicadas",
    img: "/styles/soft.jpg",
  },
  {
    id: "real",
    name: "Realistic",
    description: "Luz cinematica",
    img: "/styles/real.jpg",
  },
];
