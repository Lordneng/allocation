import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {


  constructor(
    private http: HttpClient
  ) { }


}
