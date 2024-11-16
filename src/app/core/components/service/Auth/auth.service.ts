import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authHttp: HttpClient) { }

  login(data: any){
    return this.authHttp.post(environment.login, data);
  }

  verifiedID(Id: any){
    let userId = new HttpParams();
    userId = userId.append('empId', Id);
    return this.authHttp.post(environment.verifiedID, '', {params: userId});
  }

  getToken(): string | null{
    return localStorage.getItem('token');
  }

  isLoggedIn(){
    return this.getToken() !== null;
  }
}
