import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private transHttp: HttpClient) { }

  addTransaction(data: any){
    return this.transHttp.post(environment.addTransaction, data);
  }

  searchTransaction(params: { [key: string]: string }){
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      httpParams = httpParams.append(key, params[key]);
    });
    console.log("httpParams:", httpParams.toString());
//     productName
// productModel
// productDescription
    // userId = userId.append('username', Id);
    return this.transHttp.get(environment.searchTransaction, {params: httpParams});
  }
}
