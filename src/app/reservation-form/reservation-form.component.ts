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
    this.loadCronValueFromDatabase();
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
          if (parts[i] != "," && parts[i] != "-" && parts[i] != "/") {
            if (parts[i] != "*") {
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

  seconds: number[] = Array.from({ length: 60 }, (_, i) => i);
  selectedSeconds: number[] = [];

  minutes: number[] = Array.from({ length: 60 }, (_, i) => i + 1);
  selectedMinutes: number[] = [];

  hours: number[] = Array.from({ length: 24 }, (_, i) => i + 1);
  selectedHours: number[] = [];

  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  selectedDays: number[] = [];

  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  selectedMonths: number[] = [];

  dates: number[] = Array.from({ length: 7 }, (_, i) => i);
  selectedDates: number[] = [];

  toggleSelectionSecond(second: number) {
    if (this.selectedSeconds.includes(second)) {
      this.selectedSeconds = this.selectedSeconds.filter(d => d !== second);
    } else {
      this.selectedSeconds.push(second);
    }
  }

  toggleSelectionMinute(minute: number) {
    if (this.selectedMinutes.includes(minute)) {
      this.selectedMinutes = this.selectedMinutes.filter(d => d !== minute);
    } else {
      this.selectedMinutes.push(minute);
    }
  }

  toggleSelectionHour(hour: number) {
    if (this.selectedHours.includes(hour)) {
      this.selectedHours = this.selectedHours.filter(d => d !== hour);
    } else {
      this.selectedHours.push(hour);
    }
  }

  getDayName(day: number): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[(day - 1) % 7]; // Adjust for 0-based indexing if needed
  }


  toggleSelection(value: number, type: string) {
    if (type === 'day') {
      // Clear selected dates if a day is selected
      this.selectedDates = [];
      // Handle day selection/deselection logic (update selectedDays)
      if (this.selectedDays.includes(value)) {
        this.selectedDays = this.selectedDays.filter(d => d !== value);
      } else {
        this.selectedDays.push(value);
      }
    } else {
      // Clear selected days if a date is selected
      this.selectedDays = [];
      // Handle date selection/deselection logic (update selectedDates)
      if (this.selectedDates.includes(value)) {
        this.selectedDates = this.selectedDates.filter(d => d !== value);
      } else {
        this.selectedDates.push(value);
      }
    }
  }
  toggleSelectionMonth(month: number) {
    if (this.selectedMonths.includes(month)) {
      this.selectedMonths = this.selectedMonths.filter(d => d !== month);
    } else {
      this.selectedMonths.push(month);
    }
  }
  submit() {
    console.log(this.selectedDays);
    console.log(this.selectedMonths);
    console.log(this.selectedHours);
    console.log(this.selectedMinutes);
    console.log(this.selectedSeconds);
    console.log(this.cronValue);
    this.updateCronFromSelections();
  }

  loadCronValueFromDatabase() {
    const cronFromDatabase = "2 3 5 5 6 2"; // Assume cron string fetched from database
    this.parseCronString(cronFromDatabase);
  }

  parseCronString(cronString: string) {
    const parts = cronString.split(/\s+/);
    console.log(parts);
    
    // Extract seconds part
    const secondPart = parts[0];
    const selectedSecondValues = secondPart.split(',').map(s => parseInt(s));
    
    // Update selectedSeconds array
    this.selectedSeconds = selectedSecondValues;

    const minutePart = parts[1];
    const selectedMinuteValues = minutePart.split(',').map(s => parseInt(s));
    
    // Update selectedSeconds array
    this.selectedMinutes = selectedMinuteValues;

    const hourPart = parts[2];
    const selectedHourValues = hourPart.split(',').map(s => parseInt(s));
    
    // Update selectedSeconds array
    this.selectedHours = selectedHourValues;

    const dayPart = parts[3];
    const selectedDayValues = dayPart.split(',').map(s => parseInt(s));
    
    // Update selectedSeconds array
    this.selectedDays = selectedDayValues;

    const monthPart = parts[4];
    const selectedMonthValues = monthPart.split(',').map(s => parseInt(s));
    
    // Update selectedSeconds array
    this.selectedMonths = selectedMonthValues;

    const datePart = parts[5];
    const selectedDateValues = datePart.split(',').map(s => parseInt(s));
    
    // Update selectedSeconds array
    this.selectedDates = selectedDateValues;
    
  }

  updateCronFromSelections() {
    const secondString = this.selectedSeconds.join(",");
    const minuteString = this.selectedMinutes.join(",");
    const hourString = this.selectedHours.join(",");
    const dateString = this.selectedDays.join(",");
    const monthString = this.selectedMonths.join(",");
    const dayString = this.selectedDates.join(",");
  
    // Cập nhật chuỗi cron với các giá trị đã chọn
    this.cronValue = `${secondString} ${minuteString} ${hourString} ${dateString} ${monthString} ${dayString}`;
    console.log(this.cronValue);
    
  }
}

