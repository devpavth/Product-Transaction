import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginTime: Date | null = null;

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

  setLoginTime(time: any){
    this.loginTime = time;
    localStorage.setItem('loginTime', time.toISOString());
  }

  getLoginTime(){
    const storedTime = localStorage.getItem('loginTime');
    return storedTime ? new Date(storedTime) : this.loginTime;
  }

  updateUserInfo(id: any, data: any){
    return this.authHttp.post(environment.userInfo + id, data);
  }
}
