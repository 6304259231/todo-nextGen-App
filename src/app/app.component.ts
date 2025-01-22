import { Component } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { WrapperComponent } from './wrapper/wrapper.component';



@Component({
  selector: 'app-root',
  imports: [NavComponent, WrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(){
    console.log("App root constructor");
  }
  title = 'todo';
}
