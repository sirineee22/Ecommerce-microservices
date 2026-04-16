/** DTO from backend API */
export interface DiscussionApi {
  id: number;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  upvotes: number;
  comments: number;
  views: number;
  badge?: string;
  createdAt: string;
}

export interface CreateDiscussionDto {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  badge?: string;
}

export interface UpdateDiscussionDto {
  title?: string;
  content?: string;
  categoryId?: string;
  badge?: string;
}

export interface CommentApi {
  id: number;
  discussionId: number;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface CreateCommentDto {
  content: string;
  authorId: string;
  authorName: string;
}

export interface UpdateCommentDto {
  content: string;
}
