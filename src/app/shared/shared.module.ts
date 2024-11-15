import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { DeleteComponent } from './delete/delete.component';


@NgModule({
  declarations: [
    DeleteComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    DeleteComponent
  ]
})
export class SharedModule { }
