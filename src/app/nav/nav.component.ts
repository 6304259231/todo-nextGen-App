import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoService } from '../todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  isAuthenticated: any;
  constructor(private todoService : TodoService){}
  ngOnInit(){
   this.todoService.authStatusSubject.subscribe((isAuthenticate)=>{
     this.isAuthenticated = isAuthenticate;
   })
  }

}


