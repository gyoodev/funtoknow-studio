export interface Project {
  id: string;
  title: string;
  award: string;
  awardType: string;
  date: string;
  location: string;
  imageUrl: string;
  imageHint: string;
  logo: string;
  logoBg: string;
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
  photoURL?: string;
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';
  url: string;
  order: number;
}

export interface SiteSettings {
  siteName: string;
  description: string;
  metaTags?: string;
  loginActive: boolean;
  registerActive: boolean;
  underDevelopment: boolean;
  showSystemNotification: boolean;
  systemNotification?: string;
}

    