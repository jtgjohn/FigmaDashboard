import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(){
  	window.location.href = "https://www.figma.com/oauth?client_id=x1j28cPngqZlHPQRV86vax&redirect_uri=http://localhost:4200/home&scope=file_read&state=1234&response_type=code";
  }

}
