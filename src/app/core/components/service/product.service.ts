import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private productHttp: HttpClient) { }

  getAllProduct(params: { [key: string]: string | number }){
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
    httpParams = httpParams.append(key, params[key].toString());
  });

    return this.productHttp.get(environment.getAllProduct, { params: httpParams });
  }

  postProduct(data: any){
    return this.productHttp.post(environment.postProduct, data);
  }

  deleteProduct(productId: any){
    return this.productHttp.post(environment.deleteProduct + productId, '')
  }

  updateProduct(productId: any, data: any){
    console.log("Get Url:", environment.updateProduct + productId)
    return this.productHttp.post(environment.updateProduct + productId, data)
  }

//   updatePage(params: { [key: string]: string }){
//     let httpParams = new HttpParams();
//     Object.keys(params).forEach((key) => {
//       httpParams = httpParams.append(key, params[key]);
//     });
//     console.log("httpParams for pagination:", httpParams.toString());
// //     next page - page=3
// //  previous page - page=2
// // size - records per page = 10 per page(Default)
//     // userId = userId.append('username', Id);
//     return this.productHttp.get(environment.pagination, {params: httpParams});
//   }
}
