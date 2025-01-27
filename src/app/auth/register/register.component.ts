import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../todo.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-register',
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatDatepickerModule, MatOption, MatSelectModule, ReactiveFormsModule, FormsModule, CommonModule, MatIconModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor( private todoService: TodoService, private toastr:ToastrService, private router: Router){}
  isLoadingByApi : boolean = false;
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  register = new FormGroup({
    firstName: new FormControl("", [Validators.minLength(4), Validators.required]),
    lastName: new FormControl("", [Validators.required, ]),
    email: new FormControl("", [Validators.email, Validators.required]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      this.hasUpper,
      this.hasDigit,
      this.hasSpecialChar
    ]),
    confirmPassword: new FormControl("", [Validators.required, this.passwordMatchValidator]),
    mobile: new FormControl("", [Validators.minLength(10), Validators.required]),
    gender: new FormControl("", [Validators.required]),  
    address: new FormControl("", [Validators.required]),  
    city: new FormControl("", [Validators.required]),  
    dob: new FormControl("", [Validators.required]),
  }, { validators: this.passwordMatchValidator } );


  registerNew(): void {
    this.isLoadingByApi = true;
    if(this.register?.valid){
      this.todoService.registerNewUser(this.register.value).subscribe({
        next : (response)=>{
          if(response){
            this.toastr.success(response?.message, 'Success');
            console.log('Registration successful', response);
            this.router.navigateByUrl('/login');
            this.isLoadingByApi = false;
          }
        },
        error : (error)=>{
          this.isLoadingByApi = false;
          this.toastr.error('Register Failed, Please try again later', "Error")
          console.error('Registration failed', error);
        }
      })
    }
    else {
      this.toastr.warning('Please fill out all required fields.', 'Warning');
      console.log('Form is invalid');
    }
  }

  hasUpper(control: any) {
    let hasUpperCase = /[A-Z]/;
    if (!hasUpperCase.test(control?.value)) return { "noUpperCase": true };
    return null;
  };

  hasDigit(control: any) {
    let hasDigit = /\d/;
    if (!hasDigit.test(control?.value)) return { "noDigit": true };
    return null
  }

  hasSpecialChar(control: any) {
    let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!hasSpecialChar.test(control.value)) return { "noSpecialChar": true };
    return null
  };

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { "noPasswordMatch" : true };
  }

  restrictTo10Digits(event: any): void {
    const input = event.target;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10); // Trim to 10 digits
      this.register.get('mobile')?.setValue(input.value); // Update form control value
    }
  }

  login(){
    this.router.navigateByUrl('/login')
  }
  
}
