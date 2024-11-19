import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { LoginComponent } from './login/login.component';
import { UserInfoComponent } from '../components/admin/User/user-info/user-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'home',
    component: StartingPageComponent,
    children: [
      {
        path: '',

        loadChildren: () =>
          import('../components/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      { 
        component: UserInfoComponent, 
        path: 'userInfo' 
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
