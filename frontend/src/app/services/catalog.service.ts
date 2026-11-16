import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { AuthService, User } from './auth.service';
export interface CatalogItem { id: string; kind: 'category' | 'tag' | 'type'; name: string; }
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly url = 'http://localhost:3000/api/admin';
  constructor(private readonly http: HttpClient, private readonly auth: AuthService) {}
  getAll() { return this.http.get<{data: CatalogItem[]}>(this.url + '/catalog').pipe(map(r => r.data)); }
  save(item: {kind: string; name: string}, id = '') {
    return id ? this.http.put(this.url + '/catalog/' + id, item, this.auth.options) : this.http.post(this.url + '/catalog', item, this.auth.options);
  }
  delete(id: string) { return this.http.delete(this.url + '/catalog/' + id, this.auth.options); }
  users() { return this.http.get<{data: User[]}>(this.url + '/users', this.auth.options).pipe(map(r => r.data)); }
  updateUser(user: User) { return this.http.put(this.url + '/users/' + user.id, { active: user.active, role: user.role }, this.auth.options); }
}
