import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of, tap, throwError } from 'rxjs';
export interface User { id: string; name: string; email: string; role: 'user' | 'admin'; active?: boolean; }
interface Session { user: User; token: string; }
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly state = new BehaviorSubject<User | undefined>(undefined);
  readonly changes = this.state.asObservable();
  get user() { return this.state.value; }
  private readonly url = 'http://localhost:3000/api/auth';
  constructor(private readonly http: HttpClient) {
    if (sessionStorage.getItem('token')) this.http.get<{user: User}>(this.url + '/me', this.options).subscribe({ next: result => this.state.next(result.user), error: () => { sessionStorage.removeItem('token'); } });
  }
  get options() { return { headers: { Authorization: 'Bearer ' + (sessionStorage.getItem('token') || '') } }; }
  login(email: string, password: string) {
    return this.http.post<Session>(this.url + '/login', { email, password }).pipe(tap(result => this.setSession(result)));
  }
  register(name: string, email: string, password: string) {
    return this.http.post<Session>(this.url + '/register', { name, email, password }).pipe(tap(result => this.setSession(result)));
  }
  logout() { return this.http.post<void>(this.url + '/logout', {}, this.options).pipe(catchError(response => response.status === 401 ? of(undefined) : throwError(() => response)), tap(() => { this.state.next(undefined); sessionStorage.removeItem('token'); })); }
  canManage(owner: string) { return !!this.user && (this.user.id === owner || this.user.role === 'admin'); }
  private setSession(result: Session) { this.state.next(result.user); sessionStorage.setItem('token', result.token); }
}
