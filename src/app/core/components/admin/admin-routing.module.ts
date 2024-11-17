import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { AddVendorComponent } from './vendor/add-vendor/add-vendor.component';
import { ProductListComponent } from './Products/product-list/product-list.component';
import { ViewProductComponent } from './Products/view-product/view-product.component';
import { AddProductComponent } from './Products/add-product/add-product.component';
import { StockComponent } from './Products/stock/stock.component';
import { CustomerListComponent } from './Customer/customer-list/customer-list.component';
import { AddCustomerComponent } from './Customer/add-customer/add-customer.component';

import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    component: VendorListComponent,
    path: 'vendorList'
  },
  { 
    component: AddVendorComponent, 
    path: 'addVendor' 
  },
  { 
    component: ProductListComponent, 
    path: 'productList' 
  },
  { 
    component: ViewProductComponent, 
    path: 'viewProduct' 
  },
  { 
    component: AddProductComponent, 
    path: 'addProduct' 
  },
  { 
    component: StockComponent, 
    path: 'inoutstock' 
  },
  { 
    component: CustomerListComponent, 
    path: 'customerList' 
  },
  { 
    component: AddCustomerComponent, 
    path: 'addCustomer' 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, SharedModule]
})
export class AdminRoutingModule { }
