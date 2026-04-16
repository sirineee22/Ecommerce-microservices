import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumApiService } from '../services/forum-api.service';
import { FORUM_CATEGORIES } from '../mock/forum.data';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './new-post.component.html',
})
export class NewPostComponent {
  private forumApi = inject(ForumApiService);
  private router = inject(Router);

  categories = FORUM_CATEGORIES;
  title = '';
  content = '';
  categoryId = 'achats-ventes';
  submitting = false;
  error = '';

  submit() {
    this.error = '';
    if (!this.title.trim()) {
      this.error = 'Le titre est requis.';
      return;
    }
    if (!this.content.trim()) {
      this.error = 'Le contenu est requis.';
      return;
    }
    this.submitting = true;
    this.forumApi
      .createDiscussion({
        title: this.title.trim(),
        content: this.content.trim(),
        categoryId: this.categoryId,
        authorId: '1',
        authorName: 'Utilisateur',
      })
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (d) => {
          if (d) this.router.navigate(['/forum', 'discussions', d.id]);
          else this.error = 'Erreur lors de la création.';
        },
        error: () => (this.error = 'Erreur de connexion.'),
      });
  }
}
