import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

  reservations: Reservation[] = [];
  students: any[] = [];

  constructor(private reservationService: ReservationService) {
    
  }

  ngOnInit(): void {
   this.reservationService.getAllReservations().subscribe(reservations => this.reservations = reservations);
   this.reservationService.getAllStudents().subscribe(students => this.students = students);
   console.log(this.students);
   
  }
  
  deleteReservation(id: number): void {
    this.reservationService.deleteReservation(id).subscribe(() => {
      console.log('Reservation deleted successfully');
    });
    this.reservationService.getAllReservations().subscribe(reservations => this.reservations = reservations);
  }

}
