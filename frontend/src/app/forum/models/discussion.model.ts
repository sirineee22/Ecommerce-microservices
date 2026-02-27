export type DiscussionBadge = 'pinned' | 'hot' | 'new' | 'popular';

export interface Discussion {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  categoryId: string;
  author: { id: string; name: string; initials: string };
  createdAt: string;
  upvotes: number;
  comments: number;
  views: number;
  badge?: DiscussionBadge;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface ForumMember {
  rank: number;
  id: string;
  name: string;
  initials: string;
  points: number;
}
