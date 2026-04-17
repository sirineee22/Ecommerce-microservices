import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../shared/models/event';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.eventApiUrl}`;

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  createEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event);
  }

  updateEvent(id: number, event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}


