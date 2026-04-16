import { Component, input, signal, effect, inject } from '@angular/core';
import { forkJoin, finalize } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumApiService, type Comment } from '../services/forum-api.service';
import type { Discussion } from '../models/discussion.model';

@Component({
  selector: 'app-discussion-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './discussion-detail.component.html',
})
export class DiscussionDetailComponent {
  private forumApi = inject(ForumApiService);
  private router = inject(Router);

  id = input.required<string>();
  discussion = signal<Discussion | null>(null);
  comments = signal<Comment[]>([]);
  loading = signal(true);
  editing = signal(false);
  editTitle = '';
  editContent = '';
  saving = false;
  newCommentContent = '';
  submittingComment = false;
  editingCommentId = signal<string | null>(null);
  editCommentContent = '';
  savingComment = false;
  deletingCommentId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) this.load(id);
    });
  }

  load(id: string) {
    this.loading.set(true);
    forkJoin({
      discussion: this.forumApi.getDiscussion(id),
      comments: this.forumApi.getComments(id),
    }).subscribe({
      next: ({ discussion, comments }) => {
        this.discussion.set(discussion ?? null);
        this.comments.set(comments);
      },
      error: () => this.discussion.set(null),
      complete: () => this.loading.set(false),
    });
  }

  addComment() {
    const d = this.discussion();
    const content = this.newCommentContent?.trim();
    if (!d || !content || this.submittingComment) return;
    this.submittingComment = true;
    this.forumApi
      .addComment(d.id, {
        content,
        authorId: d.author.id,
        authorName: d.author.name,
      })
      .pipe(finalize(() => (this.submittingComment = false)))
      .subscribe({
        next: (comment) => {
          if (comment) {
            this.comments.update((list) => [...list, comment]);
            this.newCommentContent = '';
          }
        },
      });
  }

  startEditComment(c: Comment) {
    this.editingCommentId.set(c.id);
    this.editCommentContent = c.content;
  }

  cancelEditComment() {
    this.editingCommentId.set(null);
  }

  saveEditComment() {
    const d = this.discussion();
    const id = this.editingCommentId();
    const content = this.editCommentContent?.trim();
    if (!d || !id || !content || this.savingComment) return;
    this.savingComment = true;
    this.forumApi
      .updateComment(d.id, id, { content })
      .pipe(finalize(() => (this.savingComment = false)))
      .subscribe({
        next: (updated) => {
          if (updated) {
            this.comments.update((list) =>
              list.map((c) => (c.id === id ? updated : c))
            );
            this.editingCommentId.set(null);
          }
        },
      });
  }

  deleteComment(c: Comment) {
    const d = this.discussion();
    if (!d || !confirm('Supprimer ce commentaire ?')) return;
    this.deletingCommentId.set(c.id);
    this.forumApi.deleteComment(d.id, c.id).subscribe({
      next: (ok) => {
        this.deletingCommentId.set(null);
        if (ok) {
          this.comments.update((list) => list.filter((x) => x.id !== c.id));
        }
      },
    });
  }

  startEdit() {
    const d = this.discussion();
    if (d) {
      this.editTitle = d.title;
      this.editContent = d.content ?? d.excerpt;
      this.editing.set(true);
    }
  }

  cancelEdit() {
    this.editing.set(false);
  }

  saveEdit() {
    const d = this.discussion();
    if (!d || this.saving) return;
    this.saving = true;
    this.forumApi
      .updateDiscussion(d.id, { title: this.editTitle, content: this.editContent })
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (updated) => {
          if (updated) this.discussion.set(updated);
          this.editing.set(false);
        },
      });
  }

  deleteDiscussion() {
    const d = this.discussion();
    if (!d || !confirm('Supprimer cette discussion ?')) return;
    this.forumApi.deleteDiscussion(d.id).subscribe((ok) => {
      if (ok) this.router.navigate(['/forum']);
    });
  }
}
