/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import {
  ApiException,
  LoginParamsVm,
  RegisterParamsVm,
  SecurityClient,
  TokenResultVm,
  UserClient,
  UserInformationVm,
  UserVm,
  VerifyRegistrationParamsVm,
} from '../api-client/api.client';

import { Observable, of, pipe, Subscription, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import subMinutes from 'date-fns/subMinutes';
import { CacheService } from '../cache/cache.service';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtTimerSubscription: Subscription;

  constructor(
    private readonly securityClient: SecurityClient,
    private readonly userClient: UserClient,
    private readonly cacheService: CacheService,
  ) {

  }



  private readonly handleTokenMe = () => pipe(
    switchMap((result: TokenResultVm) => {
      this.cacheService.setToken(result.token);
      this.cacheService.setExpired(result.expiry);
      this._setupRefreshTimer(result);
      return this.userClient.me().pipe(
        map((data) => data)
      );
    }),
    catchError(() => of(null))
  );


  login(username: string, password: string): Observable<UserInformationVm> {
    const params = LoginParamsVm.fromJS({ username, password });
    return this.securityClient.login(params)
      .pipe(this.handleTokenMe());
  }

  loginSocial(token: string): Observable<UserInformationVm> {
    return this.securityClient.loginSocial(token).pipe(this.handleTokenMe());
  }

  register(formValue: unknown): Observable<void> {
    const params = RegisterParamsVm.fromJS(formValue);
    return this.securityClient.register(params);
  }

  /**
   *
   * @param token
   */
  verify(token: string): Observable<UserVm> {
    const params = VerifyRegistrationParamsVm.fromJS({ token });
    return this.securityClient.verify(params);
  }

  /**
   * resend verify token email
   *
   * @param email
   */
  resendVerification(email: string): Observable<void> {
    return this.securityClient.resendVerificationEmail(email);
  }

  retrieveTokenOnPageLoad(): Observable<TokenResultVm> {
    return this.securityClient.refreshToken().pipe(
      tap(() => {
      }
      ),
      catchError((err: ApiException) => {
        if (err.statusCode === 401) {
          return of(null);
        }
        return of(null);
      }),
      this.handleTokenMe()
    );
  }

  forceLogOut(): Observable<void> {
    return this.securityClient.logout();
  }

  private _setupRefreshTimer(tokenResult: TokenResultVm) {
    const { token, expiry } = tokenResult;
    const delayInMillis = differenceInMilliseconds(
      subMinutes(expiry, 1),
      new Date()
    );

    if (this.jwtTimerSubscription) {
      this.jwtTimerSubscription.unsubscribe();
    }

    this.jwtTimerSubscription = timer(delayInMillis)
      .pipe(switchMap(() => this.retrieveTokenOnPageLoad()))
      .subscribe();
  }
}
