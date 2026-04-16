import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../core/services/event.service';
import { Event } from '../shared/models/event';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit {
  private eventService = inject(EventService);
  private router = inject(Router);

  events: Event[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load events.';
        this.loading = false;
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['/events/new']);
  }

  onAddTestEvent(): void {
    this.loading = true;
    this.error = null;

    const testEvent: Omit<Event, 'id'> = {
      title: 'Test Event',
      description: 'Angular Test',
      location: 'UI',
      startDate: '2026-03-01T10:00:00',
      endDate: '2026-03-02T22:00:00',
    };

    this.eventService.createEvent(testEvent).subscribe({
      next: () => {
        this.loading = false;
        this.loadEvents();
      },
      error: () => {
        this.error = 'Error connecting to backend';
        this.loading = false;
      },
    });
  }

  onEdit(event: Event): void {
    this.router.navigate(['/events/edit', event.id]);
  }

  onView(event: Event): void {
    this.router.navigate(['/events', event.id]);
  }

  onDelete(event: Event): void {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }
    this.eventService.deleteEvent(event.id).subscribe({
      next: () => this.loadEvents(),
      error: () => (this.error = 'Failed to delete event.'),
    });
  }
}


