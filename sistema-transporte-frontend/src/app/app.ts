import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: [`
    /* Global styles */
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      width: 100%;
      height: 100%;
    }

    /* Snackbar styles */
    :host ::ng-deep .success-snackbar {
      background-color: #4caf50 !important;
      color: white !important;
    }

    :host ::ng-deep .error-snackbar {
      background-color: #f44336 !important;
      color: white !important;
    }

    :host ::ng-deep .info-snackbar {
      background-color: #2196f3 !important;
      color: white !important;
    }

    :host ::ng-deep .warning-snackbar {
      background-color: #ff9800 !important;
      color: white !important;
    }
  `]
})
export class AppComponent {
  title = 'Sistema Transporte Público';
}
