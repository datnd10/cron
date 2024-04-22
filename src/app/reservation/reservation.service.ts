import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:3000';

  private reversations: Reservation[] = [];

  constructor(private http: HttpClient) { }

  getAllReservations(): Observable<Reservation[]> {   
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`);
  }

  getReservation(id: number): Observable<Reservation> | undefined {
    return this.http.get<Reservation>(`${this.apiUrl}/reservation/${id}`);
  } 

  addReservation(reservation: Reservation): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reservation`, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservation/${id}`);
  }

  updateReservation(id: string, reservation: Reservation): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reservation/${id}`, reservation);
  }
  
}
