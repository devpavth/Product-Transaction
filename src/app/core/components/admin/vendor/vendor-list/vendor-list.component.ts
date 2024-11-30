import { Component } from '@angular/core';
import { VendorService } from '../../../service/vendor/vendor.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css'
})
export class VendorListComponent {
  _vendor: any;
  vendorData: any;
  Spinner: boolean = true;

  isVendorList: Boolean = false;
  constructor(private vendorService: VendorService) {}
  ngOnInit() {
    this.fetchallvendor();
  }

  fetchallvendor() {
    this.vendorService.getAllVendor().subscribe(
      (res: any) => {
        this._vendor = res;
        this.Spinner = false;
        console.log("Gettting all vendor details:",res);
      },
      (error) => {
        console.log("error in getting vendor details:",error);
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
      this.fetchallvendor();
    }
  }
}
