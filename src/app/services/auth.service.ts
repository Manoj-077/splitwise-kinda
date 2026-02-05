import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageKey = 'sk_user';
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.readStoredUser()
  );

  constructor(private http: HttpClient) {}

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    const params = new HttpParams().set('email', email).set('password', password);
    return this.http
      .get<User[]>(`${environment.apiUrl}/users`, { params })
      .pipe(
        map((users) => users[0]),
        tap((user) => {
          if (!user) {
            throw new Error('Invalid credentials');
          }
          this.persistUser(user);
        })
      );
  }

  signup(payload: Partial<User> & { password: string }): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users`, payload)
      .pipe(tap((user) => this.persistUser(user)));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  private persistUser(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private readStoredUser(): User | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? (JSON.parse(stored) as User) : null;
  }
}
