import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { HeaderComponent } from '../Layouts/header/header.component';
import { LeftMenuComponent } from '../Layouts/left-menu/left-menu.component';


@NgModule({
  declarations: [
    DashboardComponent,
    StartingPageComponent,
    HeaderComponent,
    LeftMenuComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
