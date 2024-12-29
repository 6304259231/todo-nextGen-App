import { Component } from '@angular/core';
import { AsideComponent } from '../aside/aside.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-wrapper',
  imports: [  AsideComponent, RouterOutlet],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.css'
})
export class WrapperComponent {
  constructor(){
    console.log("WRapper constructor");
  }
}
