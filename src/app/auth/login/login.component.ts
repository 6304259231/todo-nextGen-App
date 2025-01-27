import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../todo.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private todoService: TodoService, private toastr: ToastrService, private router: Router) { }
  login = new FormGroup({
    email: new FormControl("", [Validators.email, Validators.required]),
    password: new FormControl("", [Validators.required,]),
  },);
  isLoadingByApi : boolean = false;

  loginCheck(): void {
    if (this.login?.valid) {
      const { email, password } = this.login.value;
      this.isLoadingByApi = true;
      this.todoService.loginUser({ email, password }).subscribe({
        next: (response) => {
          if (response) {
            this.todoService.setCurrentUserIdInStorage(response?.currentUserId);
            // Show a success toast after login
            this.toastr.success(response?.message, 'Success');
            this.router.navigateByUrl('/')
          }
        },
        error: (error) => {
          this.isLoadingByApi = false;
          this.toastr.error(error?.error?.message, 'Error');
          console.error('Registration failed', error);
        },
        complete: () => {
          this.isLoadingByApi = false;
        },
      })

    }
    else {
      console.log('Form is invalid');
      this.toastr.warning('Please fill out all required fields.', 'Warning');
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
