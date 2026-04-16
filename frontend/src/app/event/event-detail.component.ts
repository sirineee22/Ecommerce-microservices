import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../core/services/event.service';
import { Event } from '../shared/models/event';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.component.html',
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);

  event: Event | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadEvent(Number(idParam));
    } else {
      this.router.navigate(['/events']);
    }
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.error = null;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load event.';
        this.loading = false;
      },
    });
  }

  backToList(): void {
    this.router.navigate(['/events']);
  }

  editEvent(): void {
    if (this.event) {
      this.router.navigate(['/events/edit', this.event.id]);
    }
  }
}


