import type { Project, BlogPost } from '@/lib/types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'MSMI Media UX Award 2018-19',
    award: 'Winner',
    awardType: 'Winner',
    date: '12 Oct 2019',
    location: 'Toronto, Canada',
    imageUrl: 'https://images.unsplash.com/photo-1655841439659-0afc60676b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMHdhdmVzfGVufDB8fHx8MTc2MjA5MzIyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'abstract waves',
    logo: 'Gamepad2',
    logoBg: 'bg-orange-500',
  },
  {
    id: '2',
    title: 'Apple Design Award 2018-19',
    award: 'Gold Winner',
    awardType: 'Gold Winner',
    date: '28 Dec 2019',
    location: 'United States',
    imageUrl: 'https://images.unsplash.com/photo-1729258171691-4faf8962d2fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGdyaWR8ZW58MHx8fHwxNzYyMDk2MTg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'abstract grid',
    logo: 'Apple',
    logoBg: 'bg-sky-500',
  },
  {
    id: '3',
    title: 'Yellow Dot Design Award 2019-20',
    award: 'Asia Pacific',
    awardType: 'Asia Pacific',
    date: '28 Nov 2019',
    location: 'United Nation',
    imageUrl: 'https://images.unsplash.com/photo-1533135091724-62cc5402aa20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGxpbmVzfGVufDB8fHx8MTc2MjA4ODI4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'abstract lines',
    logo: 'Codepen',
    logoBg: 'bg-yellow-500',
  },
  {
    id: '4',
    title: "Indiana's Best Design 2019-20",
    award: 'Runner up',
    awardType: 'Runner up',
    date: '28 Nov 2019',
    location: 'North America',
    imageUrl: 'https://storage.googleapis.com/aifirebase.appspot.com/assets/project-card-4.svg',
    imageHint: 'abstract dots',
    logo: 'Play',
    logoBg: 'bg-emerald-500',
  },
  {
    id: '5',
    title: 'UMO UX India Award 2020-21',
    award: 'Silver Winner',
    awardType: 'Silver Winner',
    date: '30 Dec 2019',
    location: 'Hyderabad, India',
    imageUrl: 'https://storage.googleapis.com/aifirebase.appspot.com/assets/project-card-5.svg',
    imageHint: 'abstract stripes',
    logo: 'Codepen',
    logoBg: 'bg-yellow-400',
  },
  {
    id: '6',
    title: 'Best Music Album 2018-19',
    award: 'Winner',
    awardType: 'Winner',
    date: '13 Aug 2019',
    location: 'Mumbai, India',
    imageUrl: 'https://storage.googleapis.com/aifirebase.appspot.com/assets/project-card-6.svg',
    imageHint: 'abstract confetti',
    logo: 'Tiktok',
    logoBg: 'bg-rose-500',
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
