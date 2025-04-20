import { environment } from './../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ResetPassword } from '../shared/Models/ResetPassowrd';
import { ActiveAccount } from '../shared/Models/ActiveAccount';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  baseURL=environment.baseURL
  constructor(private http:HttpClient) { }
/*   register(form:any){
    return this.http.post(this.baseURL+"Account/Register",form)
  } */
    register(form: any): Observable<any> {
      return this.http.post(this.baseURL + "Account/Register", form).pipe(
        catchError(error => {
          // يمكنك معالجة الخطأ هنا إذا لزم الأمر
          return throwError(error);
        })
      );
    }
  active(param:ActiveAccount){
    return this.http.post(this.baseURL+"Account/active-account",param)
  }
  Login(form:any){
    return this.http.post(this.baseURL+"Account/Login",form)
  }
  forgetPassword(email:string){
    return this.http.get(this.baseURL+`Account/send-email-forget-password?email=${email}`)
  }
  ResetPassword(param:ResetPassword){
   return this.http.post(this.baseURL+"Account/reset-password",param)
  }
}
