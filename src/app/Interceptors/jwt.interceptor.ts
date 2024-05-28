import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../Services/account.service';
import { take } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  accountService.currentUser$.pipe(take(1)).subscribe({
    next: user => {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user?.token}`
        }
      })
    }
  })
  return next(req);
};
