import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const rawUser = localStorage.getItem('sk_user');
    let modifiedRequest = request;

    if (rawUser) {
      const user = JSON.parse(rawUser) as User;
      modifiedRequest = request.clone({
        setHeaders: { 'X-User-Id': user.id?.toString() ?? '' }
      });
    }

    return next.handle(modifiedRequest);
  }
}
