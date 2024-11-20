import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/Auth/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {

  @Input() userData: any;

  window: any;
  constructor(
    private Router: Router,
    private readonly auth: AuthService,
  ) {}
  loginForm = new FormGroup({
    companyId: new FormControl(''),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  
  ngOnInit() {
    // this.loginForm.get('empPassword')?.disable();
    // if (sessionStorage.getItem('userId')) {
    //   this.Router.navigate(['home/dashboard']);
    // }
    const storedUser = sessionStorage.getItem('userData');
    console.log("loading...:",sessionStorage.getItem('userData'));
    console.log("storeee user:", storedUser)
    if(storedUser){
      const parsedUserData = JSON.parse(storedUser);
      const companyId = parsedUserData.companyId;
      console.log("user login data in userinfo component:", parsedUserData);
      this.loginForm.patchValue({
        companyId: parsedUserData.companyId,
        username: parsedUserData.username,
        password: parsedUserData.password,
      });
    }
    // console.log("stored user:", storedUser);
    
    Object.keys(this.loginForm.controls).forEach((form) => {
      this.loginForm.get(form)?.disable();
    });
  }
  ngOnChanges() {
    console.log('Received userData in UserInfoComponent:', this.userData);
  }
  //login data name declare
  userid: any;
  branchid: any;

  isSave: boolean = false;
  isEdit: boolean = true;
  isSaveIcon: boolean = true;

  isPasswordHidden = true; //password visiable
  passwordEnabled: boolean = false; //password enable

  // error mesg
  isVerfied: number = 0;
  passwordVerified: number = 0;

  
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
  editUser() {
    Object.keys(this.loginForm.controls).forEach((form) => {
      this.loginForm.get(form)?.enable();
    });
    this.isSave = true;
    this.isEdit = false;

    // const loginTime = new Date();
    // this.auth.setLoginTime(loginTime);
    // console.log("Login Time:", loginTime);
    
    // console.log('login data', loginData);

    // this.userData = loginData;
    // this.auth.login(loginData).subscribe(
    //   (res) => {
    //     this.userData = res;
    //     console.log("login details from backend:",res);

    //     if ((res !== null)) {
    //       this.userid = this.userData?.employeeId;

    //       sessionStorage.setItem('userId', this.userid);
    //       sessionStorage.setItem('token', this.userData.token);
    //       this.Router.navigate(['home/dashboard']);

    //       console.log(this.userData);
    //     } else {
    //       alert('error');
    //     }
    //   },
    //   (error) => {
    //     console.log("error while login:",error);
    //     if (error.status == 403) {
    //       this.passwordVerified = 1;
    //     }
    //     if (error.status === 0) {
    //       console.log('offline');
    //     }
    //   },
    // );
  }

  onUpdateUserInfo(data: any) {
    const storedUser = sessionStorage.getItem('userData');
    if(storedUser){
      const parsedUserData = JSON.parse(storedUser);
      console.log("parsedUserData:", parsedUserData);
      const companyId = parsedUserData.companyId;
      data.companyId = companyId;
      console.log("user login id in userinfo component:", companyId);
      console.log("user login data in userinfo component:", data);

      this.auth.updateUserInfo(companyId, data).subscribe(
        (res) => {
          console.log("Updating user info from backend service:",res);
        },
        (error) => {
          console.log("error while updating user info:",error);
          if (error.status == 200) {
            this.Router.navigate(['/home/userInfo']);
          }
        },
      );
    }
    console.log("stored user:", storedUser);
    // data.companyId = companyId;
    console.log("Update user data:",data);
    let id = this.loginForm.get('companyId')?.value;
    console.log("company id:",id);

   
  }
}

