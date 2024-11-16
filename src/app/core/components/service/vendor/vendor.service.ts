import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private vendorHttp: HttpClient) { }

  addVendor(data: any){
    return this.vendorHttp.post(environment.addVendor, data)
  }

  getAllVendor(){
    return this.vendorHttp.get(environment.getAllVendorList);
  }

  deleteVendor(id: any){
    return this.vendorHttp.post(environment.deleteVendor + id, '');
  }

  updateVendor(id: any, data: any){
    return this.vendorHttp.post(environment.updateVendor + id, data);
  }

  updateBank(id: any, data: any){
    return this.vendorHttp.post(environment.updateBank + id, data);
  }
}
