import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscriber } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { PermissionService } from './permision.service';
import { IdleService } from './Idle-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'AuthorizedToken';
  private authorizedUser: any | null;
  private isAuthorized = false;
  private userProfile: any | null;

  public thisMenu: any;
  url = environment.apiUrlNestJS;
  urlService = environment.apiUrlService;

  redirectUrl: string;
  authorizedUser$: BehaviorSubject<any | null>;
  isAuthorized$: BehaviorSubject<boolean>;
  userProfile$: BehaviorSubject<any | null>;
  errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  menuAll: any = {};
  public menuAll$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public menu$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private router: Router, private baseService: BaseService,
    private idleService: IdleService,
    private permissionService: PermissionService, private httpClient: HttpClient) {
    this.authorizedUser = null;
    this.authorizedUser$ = new BehaviorSubject<any | null>(this.authorizedUser);
    this.isAuthorized = false;
    this.isAuthorized$ = new BehaviorSubject<boolean>(this.isAuthorized);
    this.userProfile = null;
    this.userProfile$ = new BehaviorSubject<any | null>(this.userProfile);

    this.checkAuthorizedUser().subscribe(result => {
      if (result) {
        this.authorizedUser = _.cloneDeep(result);
        this.isAuthorized = this.authorizedUser.isAuthorizedUser;
        this.isAuthorized$.next(this.isAuthorized);
        this.userProfile = this.baseService.getLocalStorage('userProfile');
        setTimeout(() => {
          this.getPermission();
        }, 100);

      } else {
        this.authorizedUser = null;
        // this.isAdmin = false;
        // this.isAdmin$.next(this.isAdmin);
        this.isAuthorized$.next(false);
        this.userProfile = null;
      }
      this.authorizedUser$.next(this.authorizedUser);
      this.userProfile$.next(this.userProfile);
      this.baseService.setLocalStorage(this.storageKey, _.cloneDeep(result));
    });
  }

  checkAuthorizedUser(): Observable<any | null> {
    const source = of(this.baseService.getLocalStorage(this.storageKey));
    return source.pipe(
      tap(result => {
        // console.log('checkAuthorizedUser', _.cloneDeep(result));
      }),
      map(result => {
        if (result) {
          if (result.isAuthorizedUser) {
            result.sessionTimeout = result.sessionTimeout ? result.sessionTimeout : 1440;
            if (result.lastLoggedin) {
              const lastLoginDate = moment(result.lastLoggedin, 'YYYY-MM-DD HH:mm:ss.SSS');
              const diffMoment = moment().diff(lastLoginDate, 'minutes', true);
              if (diffMoment > result.sessionTimeout) {
                result.isAuthorizedUser = false;
              } else {
                result.isAuthorizedUser = true;
              }
            } else {
              result.isAuthorizedUser = false;
            }
          }
        }
        return result;
      })
    );
  }

  login(account: any, calback?) {
    const requestData = {
      username: account.username,
      password: account.password
    };
    if (!environment.production) {

      this.loginNestjs(requestData, calback);
      return;
    }
    this.httpClient.get(`${this.urlService}LogLdap`, { params: requestData }).subscribe(res => {
      console.log('res', res);
      if (res && res === true) {
        this.loginNestjs(requestData, calback);
      }

    }, error => {
      console.error(error);
      if (calback) {
        calback();
      }
      let errorMsg = this.baseService.getErrorMessage(error);
      errorMsg = errorMsg ? errorMsg : 'Login Fails! Username or Password is not correct';
      this.errorMessage$.next(errorMsg);
    })

  }
  loginNestjs(requestData, calback?) {
    this.httpClient.post(`${this.url}auth/login`, requestData, {}).subscribe((result: any) => {
      console.log('result', result);
      if (result && result.access_token) {
        this.authorizedUser = _.cloneDeep(result);
        this.authorizedUser = _.set(this.authorizedUser, 'isAuthorizedUser', true);
        const lastLoginDate = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        this.authorizedUser = _.set(this.authorizedUser, 'lastLoggedin', lastLoginDate);
        this.errorMessage$.next('');
        this.isAuthorized = true;
        this.isAuthorized$.next(this.isAuthorized);
        this.authorizedUser$.next(this.authorizedUser);
        this.baseService.setLocalStorage(this.storageKey, this.authorizedUser);
        this.loadUserProfile();
      } else {
        this.errorMessage$.next('Login Fails!');
        this.isAuthorized = false;
        this.isAuthorized$.next(this.isAuthorized);
        this.authorizedUser$.next(this.authorizedUser);
        this.baseService.setLocalStorage(this.storageKey, this.authorizedUser);
      }
      if (calback) {
        calback();
      }
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1);
    }, error => {

      let errorMsg = this.baseService.getErrorMessage(error);
      errorMsg = errorMsg ? errorMsg : 'Login Fails! Username or Password is not correct';
      this.errorMessage$.next(errorMsg);
      if (calback) {
        calback();
      }
    });
  }
  logout() {
    return new Observable((subscriber: Subscriber<any>) => {
      this.authorizedUser = null;
      this.isAuthorized$.next(false);
      this.userProfile = null;
      this.baseService.setLocalStorage(this.storageKey, this.authorizedUser);
      this.baseService.setLocalStorage('userProfile', this.userProfile);
      this.checkAuthorizedUser().subscribe(result => {
        subscriber.next(this.authorizedUser);
      }, error => {
        subscriber.error(error);
      });
    });

  }

  loadUserProfile() {
    this.httpClient.get(`${this.url}profile`).subscribe(result => {
      if (result) {
        this.userProfile = _.cloneDeep(result);
        this.getPermission();
        this.baseService.setLocalStorage('userProfile', this.userProfile);
      } else {
        this.baseService.setLocalStorage('userProfile', null);
      }
    });
  }

  getUserProfile() {
    setTimeout(() => {
      if (!this.userProfile) {
        this.logout().subscribe(() => {
          this.router.navigate(['login']);
        });
      }
    }, 1000);
    return this.userProfile;
  }
  getIsAuthorized() {
    return this.isAuthorized;
  }
  getToken() {
    return this.authorizedUser ? this.authorizedUser.access_token : '';
  }

  getPermission() {
    this.permissionService.getbyUserGruopId(this.userProfile?.userId).subscribe((resPermission) => {
      this.menuAll = [resPermission];
      this.menu$.next(this.menuAll);
    });
  }

}
