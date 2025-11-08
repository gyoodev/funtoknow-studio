
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  version: string;
  type: 'game' | 'app' | 'library';
  os: ('windows' | 'mac' | 'linux' | 'android' | 'ios' | 'web')[];
  videoEmbedUrl?: string;
  gallery?: { url: string; hint: string }[];
  readme?: string; // Markdown
  links?: { platform: 'github' | 'playstore' | 'appstore' | 'website' | 'steam' | 'epicgames' | 'itchio' | 'gog' | 'aptoide'; url: string }[];
  createdAt: any; // Firestore timestamp
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  author: string;
  publicationDate: any; // Firestore timestamp
  date: string;
  excerpt: string;
  imageUrl: string;
  imageHint: string;
  reactions?: Record<string, number>;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  topic: 'general' | 'project' | 'bug';
  sentDate: any; // Firestore timestamp
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
  contactEmail?: string;
  showContactEmail?: boolean;
  contactPhone?: string;
  showContactPhone?: boolean;
  contactAddress?: string;
  showContactAddress?: boolean;
}
