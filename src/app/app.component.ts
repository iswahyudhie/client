import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { User } from './Model/user';
import { AccountService } from './Services/account.service';
import { HomeComponent } from './home/home.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, NavComponent
      , HomeComponent, RouterOutlet, NgxSpinnerModule]
})
export class AppComponent implements OnInit {
  title = 'Dating App';
  users: any;
  private accountServices: AccountService;

  constructor(private http: HttpClient) {
    this.accountServices = inject(AccountService);
  }

  ngOnInit(): void {
    // this.getUsers();
    this.setCurrentUser();
  }

  // getUsers(){
  //   this.http.get('https://localhost:5001/api/users').subscribe({
  //     next: response => this.users = response,
  //     error: error => console.log(error),
  //     complete: () => console.log('Request Complete')
      
  //   })
  // }

  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if (!userString) {
      return
    }
    const user: User = JSON.parse(userString);
    this.accountServices.setCurrentUser(user);
  }
}
