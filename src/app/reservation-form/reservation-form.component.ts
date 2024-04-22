import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as cronParser from 'cron-parser';
import * as cronValidator from 'cron-validator';
import cronstrue from 'cronstrue';
@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {

  reservationForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private route: ActivatedRoute) {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const reservationId = this.route.snapshot.params['id'];
    if (reservationId) {
      this.reservationService.getReservation(reservationId)?.subscribe(reservation => {
        if (reservation) {
          this.reservationForm.patchValue(reservation);
        }
      });
    }
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      let reservation = this.reservationForm.value;

      const reservationId = this.route.snapshot.params['id'];
      if (reservationId) {
        reservation.id = reservationId;
        this.reservationService.updateReservation(reservationId, reservation).subscribe(() => {
          console.log('Reservation updated successfully');
        });
      }
      else {
        this.reservationService.addReservation(reservation).subscribe(() => {
          console.log('Reservation added successfully');
        });
      }
      this.router.navigate(['/list']);
    }
  }

  cronValue: string = '';

  validationMessage: string = '';
  validateCron() {
    try {
      const userInput = this.cronValue.trim();

      const parts = userInput.split(/\s+/);

      console.log(parts);
      let cronString = "* * * * * * *";
      let indexReplace = 0;
      const isValid = parts.every(part => /^[\d*\/,-]+$/.test(part));

      if (isValid) {

        for (let i = 0; i < parts.length; i++) {
          if(parts[i] != "," &&  parts[i] != "-" && parts[i] != "/") {
            if(parts[i] != "*") {
              console.log(indexReplace);
              cronString = cronString.replace(/\*/, parts[indexReplace]);
            } 
          }
          indexReplace++;
        }

        console.log(cronString);
        

        let result = cronstrue.toString(cronString);
        console.log(result);
      } else {
        console.log("Invalid input: Only numbers are allowed.");
      }
    } catch (error) {
      console.log("error");
    }
  }
}
