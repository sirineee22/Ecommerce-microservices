import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, switchMap, startWith } from 'rxjs';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FORUM_CATEGORIES, TOP_MEMBERS, TRENDING_TAGS } from '../mock/forum.data';
import { ForumApiService } from '../services/forum-api.service';
import type { Discussion, DiscussionBadge } from '../models/discussion.model';

@Component({
  selector: 'app-forum-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './forum-home.component.html',
})
export class ForumHomeComponent implements OnInit, OnDestroy {
  private forumApi = inject(ForumApiService);
  private load$ = new Subject<void>();
  private loadSub: ReturnType<typeof this.load$.subscribe> | null = null;

  categories = FORUM_CATEGORIES;
  discussions = signal<Discussion[]>([]);
  searchQuery = signal('');
  searchInput = '';

  categoriesWithCount = computed(() => {
    const list = this.filteredDiscussions();
    return this.categories.map((cat) => ({
      ...cat,
      count: list.filter((d) => d.categoryId === cat.id).length,
    }));
  });
  loading = signal(true);
  apiError = signal(false);
  topMembers = TOP_MEMBERS;
  trendingTags = TRENDING_TAGS;
  selectedCategory = signal<string | null>(null);
  sortBy = signal<'recent' | 'popular'>('recent');

  communityStats = signal({
    members: '12.4k',
    discussions: '0',
    online: '0',
    satisfied: '98%',
  });

  filteredDiscussions = computed(() => {
    let list = this.discussions();
    const cat = this.selectedCategory();
    const q = this.searchQuery().trim().toLowerCase();
    const sort = this.sortBy();
    if (cat) list = list.filter((d) => d.categoryId === cat);
    if (q) {
      list = list.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.content?.toLowerCase().includes(q) ||
          d.excerpt?.toLowerCase().includes(q)
      );
    }
    if (sort === 'popular') {
      list = [...list].sort((a, b) => (b.upvotes + b.comments) - (a.upvotes + a.comments));
    }
    return list;
  });

  getCategoryName(categoryId: string): string {
    return this.categories.find((c) => c.id === categoryId)?.name ?? categoryId;
  }

  getCategoryIcon(icon: string): string {
    const icons: Record<string, string> = {
      check: '🛒',
      truck: '🚚',
      card: '💳',
      shield: '🛡️',
      info: '❓',
      chart: '📈',
    };
    return icons[icon] ?? '•';
  }

  ngOnDestroy() {
    this.loadSub?.unsubscribe();
  }

  ngOnInit() {
    this.loadSub = this.load$
      .pipe(
        startWith(undefined),
        switchMap(() => {
          this.loading.set(true);
          this.apiError.set(false);
          return this.forumApi
            .getDiscussions(this.selectedCategory() ?? undefined)
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (list) => {
          this.discussions.set(list);
          this.communityStats.update((s) => ({ ...s, discussions: String(list.length) }));
        },
        error: () => {
          this.discussions.set([]);
          this.apiError.set(true);
        },
      });
  }

  loadDiscussions() {
    this.load$.next();
  }

  onSearchInput() {
    this.searchQuery.set(this.searchInput);
  }

  selectCategory(id: string | null) {
    this.selectedCategory.set(id);
    this.loadDiscussions();
  }

  selectSort(value: 'recent' | 'popular') {
    this.sortBy.set(value);
  }

  resetFilters() {
    this.searchInput = '';
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.loadDiscussions();
  }

  deleteDiscussion(id: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm('Supprimer cette discussion ?')) return;
    this.forumApi.deleteDiscussion(id).subscribe((ok) => {
      if (ok) this.loadDiscussions();
    });
  }

  getBadgeClass(badge?: DiscussionBadge): string {
    switch (badge) {
      case 'pinned': return 'bg-[#1E3A8A] text-white';
      case 'hot': return 'bg-red-500 text-white';
      case 'popular': return 'bg-amber-400 text-amber-900';
      default: return '';
    }
  }

  getBadgeLabel(badge?: DiscussionBadge): string {
    switch (badge) {
      case 'pinned': return 'Épinglé';
      case 'hot': return 'Hot';
      case 'popular': return 'Populaire';
      default: return '';
    }
  }

  getBadgeIcon(badge?: DiscussionBadge): string {
    if (badge === 'pinned') return '📌';
    if (badge === 'hot') return '🔥';
    if (badge === 'popular') return '★';
    return '';
  }
}
