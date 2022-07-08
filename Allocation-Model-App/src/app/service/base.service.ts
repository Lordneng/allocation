import { Injectable } from '@angular/core';
import SHA256 from 'crypto-js/sha256';
import TripleDES from 'crypto-js/tripledes';
import CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private readonly appSecretKey: string = 'Kx6fk73KPB2bB8kn';
  private _baseUrl = environment.apiUrlNestJS;

  constructor() { }

  getLocalStorage(name: string) {
    name = this._baseUrl + name;
    let data: any = null;
    if (localStorage) {
      const key = SHA256(name).toString();
      const encryptData: string | null = localStorage.getItem(key);
      //// production
      // if (encryptData) {
      //   const item: string = TripleDES.decrypt(encryptData, this.appSecretKey).toString(CryptoJS.enc.Utf8);
      //   if (item) {
      //     data = JSON.parse(item);
      //   }
      // }
      //// end production

      //// development
      if (encryptData) {
        data = JSON.parse(encryptData);
      }
      //// end development
    }
    return data;
  }
  setLocalStorage(name: string, data: any) {
    name = this._baseUrl + name;
    if (localStorage) {
      const key = SHA256(name).toString();
      if (data) {
        //// production
        // const encryptData: string = TripleDES.encrypt(JSON.stringify(data), this.appSecretKey).toString();
        //// end production

        //// development
        const encryptData = JSON.stringify(data);
        //// end development

        localStorage.setItem(key, encryptData);
      } else {
        localStorage.removeItem(key);
      }
      return true;
    }
    return false;
  }
  clearLocalStorage() {
    if (localStorage) {
      localStorage.clear();
      return true;
    }
    return false;
  }

  // Catch Error Exceptions
  generateErrorObject(error: any): any {
    try {
      if (_.isString(error)) {
        return _.cloneDeep(JSON.parse(error));
      }
      if (_.has(error, '_body')) {
        try {
          return _.cloneDeep(JSON.parse(error._body));
        } catch (err1) {
          if (_.has(error, 'statusText')) {
            return _.get(error, 'statusText');
          }
        }
      }
      if (_.has(error, 'error')) {
        return _.cloneDeep(error.error);
      }
      if (_.isObject(error) && _.has(error, 'message')) {
        return _.cloneDeep(error);
      }
      return null;
    } catch (err2) {
      return null;
    }
  }
  getErrorMessage(dataError: any): any {
    console.log(dataError);
    const error = this.generateErrorObject(dataError);
    if (error && error.statusCode && error.message) {
      if (error.statusCode > 0) {
        return error.message;
      }
    }
    return null;
  }
  getValidationErrorMessage(dataError: any): any {
    console.log(dataError);
    const error = this.generateErrorObject(dataError);
    console.log(error);
    if (error && error.status && error.message) {
      if (error.status <= -11 && error.status >= -20) {
        return error.message;
      }
    }
    return null;
  }

  replaceCpeciaCharacters(strMaster: any) {
    let strReplace = strMaster;
    strReplace = strReplace.replace(/[^a-z^0-9^ก-๙]/gi, ''); //strReplace.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi, '');
    strReplace = _.toLower(strReplace);
    return strReplace;
  }
}
