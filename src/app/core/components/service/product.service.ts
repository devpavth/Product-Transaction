import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private productHttp: HttpClient) { }

  getAllProduct(){
    return this.productHttp.get(environment.getAllProduct);
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
}
