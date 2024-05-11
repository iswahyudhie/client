import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../Services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model: any = {}
  accountService: AccountService;
  @Output() CancelRegister = new EventEmitter()
  private toastr: ToastrService;

  constructor() {
    this.accountService = inject(AccountService);  
    this.toastr = inject(ToastrService);  
    
  }

  register(){
    this.accountService.register(this.model).subscribe({
      next: (Response) => {
        console.log(Response)
        this.cancel();
      },
      error: err => {
        this.toastr.error(err.error)
      }
    })
  }

  cancel(){
    this.CancelRegister.emit(false)
  }
}
