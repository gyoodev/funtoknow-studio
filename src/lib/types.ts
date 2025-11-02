export interface Project {
  id: string;
  title: string;
  description:string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  imageHint: string;
  links: {
    github?: string;
    live?: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  author: string;
  date: string;
  imageUrl: string;
  imageHint: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  gamingHabits?: string;
}