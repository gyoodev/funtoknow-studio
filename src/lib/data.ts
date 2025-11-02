import type { Project, BlogPost } from '@/lib/types';

export const projects: Project[] = [
  {
    id: 'cosmic-odyssey',
    title: 'Cosmic Odyssey',
    description: 'A space exploration RPG with a branching narrative.',
    longDescription: 'Cosmic Odyssey is an ambitious role-playing game set in a vast, procedurally generated galaxy. Players can explore thousands of unique star systems, engage in tactical ship combat, and shape the story through their choices. Built with Unreal Engine 5, it pushes the boundaries of visual fidelity and emergent gameplay.',
    technologies: ['Unreal Engine 5', 'C++', 'Blender'],
    imageUrl: 'https://picsum.photos/seed/1/600/400',
    imageHint: 'fantasy game',
    links: {
      github: '#',
      live: '#',
    },
  },
  {
    id: 'pixel-pioneers',
    title: 'Pixel Pioneers',
    description: 'A charming 2D farming simulator with a magical twist.',
    longDescription: 'Return to the simple life in Pixel Pioneers, a farming simulator inspired by the classics. Grow crops, raise animals, befriend villagers, and uncover the magical secrets of the valley. Its retro pixel art style and relaxing gameplay make it a perfect escape.',
    technologies: ['Godot', 'GDScript', 'Aseprite'],
    imageUrl: 'https://picsum.photos/seed/3/600/400',
    imageHint: 'pixel art',
    links: {
      github: '#',
    },
  },
  {
    id: 'cyber-heist',
    title: 'Cyber Heist',
    description: 'A fast-paced stealth action game in a cyberpunk world.',
    longDescription: 'In the neon-drenched metropolis of Neo-Kyoto, you are a ghost, an elite cyber-ninja taking on impossible heists. Cyber Heist combines fluid parkour, tactical stealth, and high-stakes action. Use advanced gadgets and your trusty katana to navigate heavily guarded corporate towers.',
    technologies: ['Unity', 'C#', 'HDRP'],
    imageUrl: 'https://picsum.photos/seed/2/600/400',
    imageHint: 'sci-fi city',
    links: {
      github: '#',
      live: '#',
    },
  },
   {
    id: 'serene-shores',
    title: 'Serene Shores',
    description: 'A relaxing island-building and exploration game.',
    longDescription: 'Escape to a tranquil paradise in Serene Shores. Build your dream island home, discover hidden coves, and interact with a charming cast of animal characters. With no pressure or time limits, its a game about creativity and finding your own peaceful corner of the world.',
    technologies: ['React Three Fiber', 'Three.js', 'Next.js'],
    imageUrl: 'https://picsum.photos/seed/4/600/400',
    imageHint: 'natural landscape',
    links: {
      live: '#',
    },
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'devlog-1-the-journey-begins',
    title: 'Devlog #1: The Journey Begins',
    excerpt: 'An inside look at the initial concept and development process of Cosmic Odyssey. We discuss our inspirations, early prototypes, and the challenges we faced.',
    content: `
# Our First Steps

This marks the beginning of our public development log for **Cosmic Odyssey**. The idea was born from a shared love for classic sci-fi and open-world RPGs. We wanted to create a universe that felt truly alive and endless.

## Core Pillars

1.  **Exploration:** The galaxy should be a character in itself.
2.  **Choice:** Every decision should have a meaningful impact.
3.  **Customization:** Players should be able to create their own unique ship and captain.

We're excited to share more with you as we progress!
`,
    author: 'Jane Doe, Lead Designer',
    date: 'March 15, 2024',
    imageUrl: 'https://picsum.photos/seed/101/800/400',
    imageHint: 'coding programming',
  },
  {
    id: '2',
    slug: 'the-art-of-pixel-pioneers',
    title: 'The Art of Pixel Pioneers',
    excerpt: 'A deep dive into the artistic direction and pixel art techniques used to bring the world of Pixel Pioneers to life. From character sprites to environmental tiles.',
    content: `
# Crafting a Retro Vibe

The visual style of **Pixel Pioneers** is a love letter to the 16-bit era. Our art team focused on a vibrant color palette and expressive character animations to create a world that is both nostalgic and fresh.

## The Process

-   **Character Design:** We started with simple silhouettes to ensure each character was recognizable.
-   **Environment:** Each tile was designed to be modular, allowing us to build diverse landscapes.

We hope the art style brings you as much joy as it brought us to create.
`,
    author: 'John Smith, Art Director',
    date: 'April 2, 2024',
    imageUrl: 'https://picsum.photos/seed/102/800/400',
    imageHint: 'gaming controller',
  },
   {
    id: '3',
    slug: 'building-neo-kyoto',
    title: 'Building Neo-Kyoto: The World of Cyber Heist',
    excerpt: 'Learn about the world-building and level design philosophy behind the cyberpunk city in Cyber Heist. How we blend verticality with stealth gameplay.',
    content: `
# A City of Lights and Shadows

Neo-Kyoto is more than just a backdrop; it's a vertical playground. Our level design team focused on creating multiple paths and opportunities for creative stealth.

## Design Philosophy

- **Verticality:** Every level is designed to be traversed horizontally and vertically.
- **Atmosphere:** We used Unity's HDRP to create the iconic neon-noir aesthetic.

The city is full of secrets. We can't wait for you to discover them.
`,
    author: 'Alex Ray, Level Designer',
    date: 'May 21, 2024',
    imageUrl: 'https://picsum.photos/seed/103/800/400',
    imageHint: 'concept art',
  },
];
