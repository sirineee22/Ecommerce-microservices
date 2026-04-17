import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Discussion } from '../models/discussion.model';
import type {
  DiscussionApi,
  CreateDiscussionDto,
  UpdateDiscussionDto,
  CommentApi,
  CreateCommentDto,
  UpdateCommentDto,
} from '../models/discussion-api.model';

export interface Comment {
  id: string;
  content: string;
  author: { id: string; name: string; initials: string };
  createdAt: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `il y a ${diffMins}min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR');
}

function apiToDiscussion(api: DiscussionApi): Discussion {
  const excerpt =
    api.content?.length > 120
      ? api.content.substring(0, 120) + '...'
      : api.content || '';

  return {
    id: String(api.id),
    title: api.title,
    excerpt,
    content: api.content,
    categoryId: api.categoryId,
    author: {
      id: api.authorId,
      name: api.authorName,
      initials: getInitials(api.authorName),
    },
    createdAt: formatRelativeTime(api.createdAt),
    upvotes: api.upvotes,
    comments: api.comments,
    views: api.views,
    badge: api.badge as Discussion['badge'],
  };
}

@Injectable({ providedIn: 'root' })
export class ForumApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.forumApiUrl}`;

  getDiscussions(categoryId?: string, search?: string): Observable<Discussion[]> {
    const params: Record<string, string> = {};
    if (categoryId) params['categoryId'] = categoryId;
    if (search?.trim()) params['q'] = search.trim();
    const options = Object.keys(params).length ? { params } : {};
    return this.http
      .get<DiscussionApi[]>(`${this.baseUrl}/discussions`, options)
      .pipe(map((list) => list.map(apiToDiscussion)));
  }

  getDiscussion(id: string): Observable<Discussion | null> {
    return this.http.get<DiscussionApi>(`${this.baseUrl}/discussions/${id}`).pipe(
      map(apiToDiscussion),
      catchError(() => of(null))
    );
  }

  getDiscussionRaw(id: string): Observable<DiscussionApi | null> {
    return this.http
      .get<DiscussionApi>(`${this.baseUrl}/discussions/${id}`)
      .pipe(catchError(() => of(null)));
  }

  createDiscussion(dto: CreateDiscussionDto): Observable<Discussion | null> {
    return this.http
      .post<DiscussionApi>(`${this.baseUrl}/discussions`, dto)
      .pipe(
        map(apiToDiscussion),
        catchError(() => of(null))
      );
  }

  updateDiscussion(
    id: string,
    dto: UpdateDiscussionDto
  ): Observable<Discussion | null> {
    return this.http
      .put<DiscussionApi>(`${this.baseUrl}/discussions/${id}`, dto)
      .pipe(
        map(apiToDiscussion),
        catchError(() => of(null))
      );
  }

  deleteDiscussion(id: string): Observable<boolean> {
    return this.http
      .delete(`${this.baseUrl}/discussions/${id}`, { observe: 'response' })
      .pipe(
        map((res) => res.status === 204),
        catchError(() => of(false))
      );
  }

  getComments(discussionId: string): Observable<Comment[]> {
    return this.http
      .get<CommentApi[]>(`${this.baseUrl}/discussions/${discussionId}/comments`)
      .pipe(
        map((list) => list.map(apiToComment)),
        catchError(() => of([]))
      );
  }

  addComment(discussionId: string, dto: CreateCommentDto): Observable<Comment | null> {
    return this.http
      .post<CommentApi>(`${this.baseUrl}/discussions/${discussionId}/comments`, dto)
      .pipe(
        map((c) => apiToComment(c)),
        catchError(() => of(null))
      );
  }

  updateComment(
    discussionId: string,
    commentId: string,
    dto: UpdateCommentDto
  ): Observable<Comment | null> {
    return this.http
      .put<CommentApi>(
        `${this.baseUrl}/discussions/${discussionId}/comments/${commentId}`,
        dto
      )
      .pipe(
        map((c) => apiToComment(c)),
        catchError(() => of(null))
      );
  }

  deleteComment(discussionId: string, commentId: string): Observable<boolean> {
    return this.http
      .delete(
        `${this.baseUrl}/discussions/${discussionId}/comments/${commentId}`,
        { observe: 'response' }
      )
      .pipe(
        map((res) => res.status === 204),
        catchError(() => of(false))
      );
  }
}

function apiToComment(c: CommentApi): Comment {
  return {
    id: String(c.id),
    content: c.content,
    author: {
      id: c.authorId,
      name: c.authorName,
      initials: c.authorName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    },
    createdAt: formatRelativeTime(c.createdAt),
  };
}
