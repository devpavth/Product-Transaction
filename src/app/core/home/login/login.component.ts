import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../components/service/Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  window: any;
  constructor(
    private Router: Router,
    private readonly auth: AuthService,
  ) {}
  ngOnInit(): void {
    this.loginForm.get('password')?.disable();
    if (sessionStorage.getItem('userId')) {
      this.Router.navigate(['home/dashboard']);
    }
  }
  //login data name declare
  userData: any;
  userid: any;
  branchid: any;
  isUserInfo: boolean = false;

  isPasswordHidden = true; //password visiable
  passwordEnabled: boolean = false; //password enable

  // error mesg
  isVerfied: number = 0;
  passwordVerified: number = 0;

  loginForm = new FormGroup({
    companyId: new FormControl(''),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  toggle() {
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  verifiedUser(id: any) {
    console.log("what Id:",id);

    this.auth.verifiedUser(id).subscribe(
      (res) => {
        console.log("username validation response from backend:",res);
        this.isVerfied = 0;
        this.loginForm.get('password')?.enable();
        this.passwordEnabled = true;
        // this.username404 = true;
      },
      (error) => {
        console.log("verifying....", error)
        if (error.status === 302) {
          this.isVerfied = 302;
          this.loginForm.get('password')?.enable();
          this.passwordEnabled = true;
        }
        if (error.status === 404) {
          this.isVerfied = 404;
          this.passwordEnabled = false;
          this.loginForm.get('password')?.disable();
          // this.username404 = false;
        }
        if (error.status === 0) {
          console.log('offline');
          this.Router.navigate(['networkerror']);
        }
      },
    );
  }
  login(loginData: any) {

    const loginTime = new Date();
    this.auth.setLoginTime(loginTime);
    console.log("Login Time:", loginTime);
    
    console.log('login data', loginData);

    this.userData = loginData;
    this.auth.login(loginData).subscribe(
      (res) => {
        this.userData = res;
        console.log("user data in login component:", this.userData);
        console.log("login details from backend:",res);
        sessionStorage.setItem('userData', JSON.stringify(res));
        // sessionStorage.setItem('userData', JSON.stringify({ companyId: '123', username: 'testUser', password: 'testPass' }));
        this.isUserInfo = true;
        if (this.isUserInfo) {
          console.log("user data after condition in login component:", this.userData);
          this.loginForm.patchValue({
            username: this.userData.username,
            password: this.userData.password,
            companyId: this.userData.companyId,
          });
        }


        if ((res !== null)) {
          this.userid = this.userData?.employeeId;

          sessionStorage.setItem('userId', this.userid);
          sessionStorage.setItem('token', this.userData.token);
          this.Router.navigate(['home/dashboard']);

          console.log(this.userData);
        } else {
          alert('error');
        }
      },
      (error) => {
        console.log("error while login:",error);
        if (error.status == 403) {
          this.passwordVerified = 1;
          // this.password403 = false
        }
        if (error.status === 0) {
          console.log('offline');
        }
      },
    );
  }
}
