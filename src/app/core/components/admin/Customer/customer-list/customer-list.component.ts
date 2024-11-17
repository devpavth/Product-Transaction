import { Component } from '@angular/core';
import { CustomerService } from '../../../service/Customer/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
  _vendor: any;
  vendorData: any;
  Spinner: boolean = true;

  isVendorList: Boolean = false;
  constructor(
    private customerService: CustomerService
  ) {}
  ngOnInit() {
    this.fetchallcustomer();
  }

  fetchallcustomer() {
    this.customerService.getAllCustomer().subscribe(
      (res) => {
        this._vendor = res;
        this.Spinner = false;
        console.log("Gettting all customer details:",res);
      },
      (error) => {
        console.log("error while getting customer details:",error);
      },
    );
  }
  toggleView(action: Boolean, check: number, vendorData: any) {
    if (check == 1) {
      this.isVendorList = action;
      this.vendorData = vendorData;
    }
    if (check == 0) {
      this.isVendorList = action;
      this.fetchallcustomer();
    }
  }
}

