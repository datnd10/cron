import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  @ViewChild('exampleModal') modal: ElementRef | undefined;
  reservationForm: FormGroup = new FormGroup({});

  updateForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private route: ActivatedRoute) {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', [Validators.required, this.noWhitespaceOnlyValidator()]],
      guestEmail: ['', [Validators.required, this.noWhitespaceOnlyValidator()]],
      roomNumber: ['', [Validators.required, this.noWhitespaceOnlyValidator()]],
    });

    this.updateForm = this.formBuilder.group({
      checkInDate: ['2', Validators.required],
      checkOutDate: ['2', Validators.required],
      guestName: ['2', [Validators.required, this.noWhitespaceOnlyValidator()]],
      guestEmail: ['2', [Validators.required, this.noWhitespaceOnlyValidator()]],
      roomNumber: ['2', [Validators.required, this.noWhitespaceOnlyValidator()]],
    });
  }

  trimWhitespace() {
    const controls = this.reservationForm.controls;
    Object.keys(controls).forEach(key => {
      if (typeof controls[key].value === 'string') {
        controls[key].setValue(controls[key].value.trim().replace(/\s+/g, ' '));
      }
    });
  }

  noWhitespaceOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (typeof value === 'string' && value.trim() === '') {
        return { 'whitespaceOnly': true };
      }
      return null;
    };
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
    // this.loadCronValueFromDatabase();
  }
  isDelete = false;
  testSubmit() {
    this.isDelete = true;
  }

  onSubmit() {
    this.trimWhitespace();
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
          console.log(2);

          console.log('Reservation added successfully');
        });
      }
      this.router.navigate(['/list']);
    }
  }
}
