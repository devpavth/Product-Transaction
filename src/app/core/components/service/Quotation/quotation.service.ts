import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  private quotehttp = inject(HttpClient);

  constructor() { }

  getAllQuotation(){
    return this.quotehttp.get(environment.quotationAll);
  }

  fetchCustomerQuotation(params: {[key: string]: string}){
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) =>{
      httpParams = httpParams.append(key, params[key]);
    });
    console.log("httpParams:", httpParams.toString());

    return this.quotehttp.get(environment.fetchCustomerQuotation, {params: httpParams});
  }

  fetchProductQuotation(params: {[key: string]: string}){
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key)=>{
      httpParams = httpParams.append(key, params[key]);
    });

    console.log("httpParams:", httpParams.toString());

    return this.quotehttp.get(environment.fetchProductQuotation, {params: httpParams});
  }

  fetchQuotationCode(){
    return this.quotehttp.get(environment.fetchQuotationCode);
  }

  fetchBankDetails(id: any){
    return this.quotehttp.get(environment.fetchBankDetails + id);
  }
}
