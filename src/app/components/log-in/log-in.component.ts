import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  constructor(private router: Router) { }
  username = '';
  password = '';
  login() {
    if (this.username === 'Goldsikka' && this.password === 'Xyug@2019') {
      alert('Login successful');
      this.router.navigate(['/home']);
    }
    else {
      alert('Invalid username or password');
    }
  }
}
