import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StartingPageComponent } from './starting-page/starting-page.component';

const routes: Routes = [
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
