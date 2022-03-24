import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  notify(message: string) {
    this.snackBar.open(message, 'CLOSE', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['neutral-snackbar']
    });
  }

  success(message:string) {
    this.snackBar.open(message, 'CLOSE', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['green-snackbar']
    })
  }

  warn(message: string) {
    this.snackBar.open(message, 'CLOSE', {
      duration:10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass:['red-snackbar']
    })
  }
}
