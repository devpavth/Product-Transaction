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
    this.loginForm.get('empPassword')?.disable();
    if (sessionStorage.getItem('userId')) {
      this.Router.navigate(['home/dashboard']);
    }
  }
  //login data name declare
  userData: any;
  userid: any;
  branchid: any;

  isPasswordHidden = true; //password visiable
  passwordEnabled: boolean = false; //password enable

  // error mesg
  isVerfied: number = 0;
  passwordVerified: number = 0;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  toggle() {
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  verifiedUser(id: any) {
    console.log(id);

    // this.auth.verifiedID(id).subscribe(
    //   (res) => {
    //     console.log(res);
    //   },
    //   (error) => {
    //     console.log("verifying....", error)
    //     if (error.status === 302) {
    //       this.isVerfied = 302;
    //       this.loginForm.get('empPassword')?.enable();
    //       this.passwordEnabled = true;
    //     }
    //     if (error.status === 404) {
    //       this.isVerfied = 404;
    //       this.passwordEnabled = false;
    //       this.loginForm.get('empPassword')?.disable();
    //     }
    //     if (error.status === 0) {
    //       console.log('offline');
    //       this.Router.navigate(['networkerror']);
    //     }
    //   },
    // );
  }
  login(loginData: any) {
    console.log('login data', loginData);

    this.userData = loginData;
    this.auth.login(loginData).subscribe(
      (res) => {
        this.userData = res;
        console.log(res);

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
        if (error.status == 403) {
          this.passwordVerified = 1;
        }
        if (error.status === 0) {
          console.log('offline');
        }
      },
    );
  }
}
