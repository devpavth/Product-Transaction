import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private customerHttp: HttpClient) { }

  getAllCustomer(){
    return this.customerHttp.get(environment.getAllCustomerList)
  }

  addCustomer(data: any){
    return this.customerHttp.post(environment.addCustomer, data)
  }
}
