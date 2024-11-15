import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { AddVendorComponent } from './vendor/add-vendor/add-vendor.component';
import { ViewVendorComponent } from './vendor/view-vendor/view-vendor.component';
import { ProductListComponent } from './Products/product-list/product-list.component';
import { ViewProductComponent } from './Products/view-product/view-product.component';
import { AddProductComponent } from './Products/add-product/add-product.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockComponent } from './Products/stock/stock.component';

import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    VendorListComponent,
    AddVendorComponent,
    ViewVendorComponent,
    ProductListComponent,
    ViewProductComponent,
    AddProductComponent,
    StockComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AdminModule { }
