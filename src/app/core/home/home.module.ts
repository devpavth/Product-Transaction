import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { HeaderComponent } from '../Layouts/header/header.component';
import { LeftMenuComponent } from '../Layouts/left-menu/left-menu.component';
import { UserInfoComponent } from '../components/admin/User/user-info/user-info.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    StartingPageComponent,
    HeaderComponent,
    LeftMenuComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [UserInfoComponent]
})
export class HomeModule { }
