import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../components/service/Auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  user: any; // fetch user
  userData: any; //fetch user data object

  emp = { empFirstName: '', empLastName: '', empEmail: '', branchName: '', };

  private authService = inject(AuthService);
  loginTime: Date | null = null;

  //User data
  FirstName :any
  LastName:string=''
  Id:string=''
  Phone:number=0
  Gender:	string=''
  Email:	string=''
  DateofBirth:any
  addressLine1:string=''
  addressLine2:string=''
  state:string=''
  city:string=''
  pin	:number=0
  country	:string=''
  empJoiningDate :any
  empRole	:string=''
  empBranch	:string=''
  empDepartment	:string=''
  empDesignation	:string=''
  empFlag:string=''

  randomColor: string | undefined;

  constructor(
    // private readonly userDetailService: EmployeeServiceService,
    // public sharedData: SharedServiceService,
  ) {
    // this.randomColor = this.getRandomColor();
  }
  ngOnInit(): void {
    this.loginTime = this.authService.getLoginTime();
    // this.user = sessionStorage.getItem('userId');
    // if (this.user) {
    //   this.userDetailService.getEmployeeDetails(this.user).subscribe((res) => {
    //     console.table(res);
    //     this.userData = res;

    //     sessionStorage.setItem('branchId', this.userData.branchCode);
    //   });
    }
  }

  // getRandomColor(): string {
  //   // Generate random RGB values
  //   const r = Math.floor(Math.random() * 256);
  //   const g = Math.floor(Math.random() * 256);
  //   const b = Math.floor(Math.random() * 256);
  //   // Construct the CSS color string
  //   return `rgb(${r}, ${g}, ${b})`;
  // }

  // profile: boolean = false; //toggle declare

  // name = sessionStorage.getItem('userId');

  // toggleSetting() {
  //   this.profile = !this.profile;
  //   setTimeout(() => {
  //     this.profile = false;
  //   }, 9000);
  // }
  // signOut() {
  //   sessionStorage.clear();
  // }
