import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../Services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, BsDatepickerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  model: any = {}
  accountService: AccountService;
  @Output() CancelRegister = new EventEmitter()
  private toastr: ToastrService;
  registerForm: FormGroup = new FormGroup({});
  fb: FormBuilder;
  router: Router;

  constructor() {
    this.accountService = inject(AccountService);
    this.toastr = inject(ToastrService);
    this.fb = inject(FormBuilder);
    this.router = inject(Router);
  }
  ngOnInit(): void {
    this.initilizeForm();
  }

  initilizeForm() {
    this.registerForm = this.fb.group({
      Username: ['', Validators.required],
      Gender: ['male', Validators.required],
      KnownAs: ['', Validators.required],
      DateofBirth: ['', Validators.required],
      City: ['', Validators.required],
      Country: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      ConfirmPassword: ['', [Validators.required, this.matchValue('Password')]]
    })

    this.registerForm.controls['Password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['ConfirmPassword'].updateValueAndValidity()
    })
  }

  matchValue(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { noMatch: true }
    }
  }

  register() {
    const dob = this.getDateOnly(this.getDateOnly(this.registerForm.controls['DateofBirth'].value))
    const values = {...this.registerForm.value, DateofBirth: dob};
    this.accountService.register(values).subscribe({
      next: (Response) => {
        this.router.navigateByUrl('/members')
      },
      error: err => {
        this.toastr.error(err.error)
      }
    })
  }

  cancel() {
    this.CancelRegister.emit(false)
  }

  control(name: string) {
    return this.registerForm.controls[name]
  }

  getDateOnly(dob: string | undefined) {
    if (!dob) {
      return
    }
    let thedob = new Date(dob);
    return new Date(thedob.setMinutes(thedob.getMinutes() - thedob.getTimezoneOffset()))
      .toISOString().slice(0, 10);
  }
}
