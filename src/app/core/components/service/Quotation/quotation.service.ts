import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
