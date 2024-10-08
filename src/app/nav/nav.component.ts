import { Component, Injectable, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../Services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../Directives/has-role.directive';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink
    , RouterLinkActive, HasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  model: any = {}
  public accountService: AccountService;
  private router: Router;
  private toastr: ToastrService;

  constructor() {
    this.accountService = inject(AccountService);  
    this.router = inject(Router);  
    this.toastr = inject(ToastrService);
  }

  ngOnInit(): void {
  }

  login(){
    this.accountService.login(this.model).subscribe({
      next: resp => {
        this.router.navigateByUrl('/members')
      }
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/')
  }

}
