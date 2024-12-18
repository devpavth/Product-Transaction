import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  private quotehttp = inject(HttpClient);

  constructor() { }

  getAllQuotation(){
    console.log("environment.quotationAll:",environment.quotationAll);
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

  saveQuotation(data: any){
    return this.quotehttp.post(environment.quotation, data);
  }

  fetchSingleQuotation(quotationId: any){
    console.log("environment.fetchSingleQuotation + quotationId:",environment.fetchSingleQuotation + quotationId);
    return this.quotehttp.get(environment.fetchSingleQuotation + quotationId);
  }
}
