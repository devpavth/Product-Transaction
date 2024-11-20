import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private transHttp: HttpClient) { }

  addTransaction(data: any){
    return this.transHttp.post(environment.addTransaction, data);
  }
}
