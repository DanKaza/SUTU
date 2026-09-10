export const COMMUNITY_CATEGORIES = [
  "Gaming",
  "Education",
  "Open Source",
  "Art",
  "Music",
  "Technology",
] as const;

export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number];

export type Community = {
  id: string;
  name: string;
  description: string;
  category: CommunityCategory;
  logoInitial: string;
  supporterCount: number;
  totalSupported: number;
  createdDaysAgo: number;
  featured?: boolean;
};

export const communities: Community[] = [
  {
    id: "pixel-forge",
    name: "Pixel Forge",
    description: "Indie game devs building and playtesting together.",
    category: "Gaming",
    logoInitial: "P",
    supporterCount: 8700,
    totalSupported: 12400,
    createdDaysAgo: 410,
    featured: true,
  },
  {
    id: "open-classroom",
    name: "Open Classroom",
    description: "Free learning resources and mentorship for new coders.",
    category: "Education",
    logoInitial: "O",
    supporterCount: 6100,
    totalSupported: 9800,
    createdDaysAgo: 260,
    featured: true,
  },
  {
    id: "libre-stack",
    name: "Libre Stack",
    description: "Maintainers of widely-used open source tooling.",
    category: "Open Source",
    logoInitial: "L",
    supporterCount: 3200,
    totalSupported: 15200,
    createdDaysAgo: 120,
  },
  {
    id: "studio-hue",
    name: "Studio Hue",
    description: "A collective of illustrators sharing process and critique.",
    category: "Art",
    logoInitial: "S",
    supporterCount: 3900,
    totalSupported: 5100,
    createdDaysAgo: 34,
    featured: true,
  },
  {
    id: "lofi-collective",
    name: "Lofi Collective",
    description: "Independent musicians producing and releasing together.",
    category: "Music",
    logoInitial: "L",
    supporterCount: 4300,
    totalSupported: 7600,
    createdDaysAgo: 190,
  },
  {
    id: "dev-rel-collective",
    name: "Dev Rel Collective",
    description: "Developer relations folks sharing playbooks and talks.",
    category: "Technology",
    logoInitial: "D",
    supporterCount: 5200,
    totalSupported: 8300,
    createdDaysAgo: 21,
  },
];

export const seedSupports = [
  {
    id: "s1",
    communityId: "pixel-forge",
    communityName: "Pixel Forge",
    logoInitial: "P",
    amount: 5,
    status: "completed" as const,
    date: "2026-09-10",
    txHash: "0x1a2b...c3d4",
  },
  {
    id: "s2",
    communityId: "open-classroom",
    communityName: "Open Classroom",
    logoInitial: "O",
    amount: 10,
    status: "completed" as const,
    date: "2026-09-08",
    txHash: "0x9f8e...7d6c",
  },
  {
    id: "s3",
    communityId: "libre-stack",
    communityName: "Libre Stack",
    logoInitial: "L",
    amount: 3,
    status: "completed" as const,
    date: "2026-09-05",
    txHash: "0x4e5f...6a7b",
  },
];
