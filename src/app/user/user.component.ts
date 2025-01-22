import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Define the User interface with the expected properties
interface User {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  dob: string;
  createdAt: string;
  gender : string;
}

@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  currentUserDetails: User = {} as User;  // Type the user details as User interface
  currentUserId: string | null = null;
  isDataLoadingByApi : boolean = false;

  constructor(private todoService: TodoService, private toastr: ToastrService, private router : Router) {}

  ngOnInit(): void {
    this.currentUserId = this.todoService.getCurrentUserIdFromStorage();  // Retrieve the user ID from storage

    // Check if the user ID exists
    if (this.currentUserId) {
      this.todoService.getCurrentUser(this.currentUserId).subscribe({
        next: (data) => {
          if (data && data.user) {
            this.currentUserDetails = data.user;
          }
        },
        error: (error) => {
          if (error) {
            this.toastr.warning('Server Error! from user', 'Warning');
            console.error('Fetching Error:', error);
          }
        }
      });
    }
  }

  logout() : void{
    this.todoService.removeCurrentUserIdFromStorage();
    this.todoService.getCurrentUserIdFromStorage()
    this.router.navigateByUrl('/login')
    this.toastr.success("Logged out succsessfully !" , "Success")
  }
}
