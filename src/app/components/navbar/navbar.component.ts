import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  
  @Input() logged: boolean = true;
  @Input() user: string;

  constructor() { }

  ngOnInit(): void {
  }

}