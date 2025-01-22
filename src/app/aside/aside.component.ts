import { Component } from '@angular/core';
import { TodoService } from '../todo.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [RouterLink],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {

  constructor(private todoServices: TodoService) {
   
  }
}
