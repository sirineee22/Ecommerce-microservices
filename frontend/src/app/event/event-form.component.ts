import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../core/services/event.service';
import { Event } from '../shared/models/event';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
})
export class EventFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required]],
    location: ['', [Validators.required, Validators.maxLength(100)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
  });

  eventId: number | null = null;
  loading = false;
  saving = false;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventId = Number(idParam);
      this.loadEvent(this.eventId);
    }
  }

  get isEdit(): boolean {
    return this.eventId !== null;
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.error = null;
    this.eventService.getEventById(id).subscribe({
      next: (event: Event) => {
        this.form.patchValue({
          title: event.title,
          description: event.description,
          location: event.location,
          startDate: event.startDate,
          endDate: event.endDate,
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load event.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as Omit<Event, 'id'>;
    this.saving = true;
    this.error = null;

    const request$ = this.isEdit && this.eventId !== null
      ? this.eventService.updateEvent(this.eventId, payload)
      : this.eventService.createEvent(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/events']);
      },
      error: () => {
        this.error = 'Failed to save event.';
        this.saving = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }
}


