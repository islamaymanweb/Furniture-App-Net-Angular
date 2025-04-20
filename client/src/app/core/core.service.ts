import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private http: HttpClient) {}
  baseURL = environment.baseURL;
  private name = new BehaviorSubject<string>('');
  userName$ = this.name.asObservable();
  logout() {
    return this.http.get(this.baseURL + 'Account/Logout').pipe(
      map(() => {
        this.name.next('');
      })
    );
  }
  getUserName() {
    return this.http.get(this.baseURL + 'Account/get-user-name').pipe(
      map((value: any) => {
        this.name.next(value.message);
      })
    );
  }
}
