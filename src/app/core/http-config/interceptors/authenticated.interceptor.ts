import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import isAfter from 'date-fns/isAfter';
import { combineLatest, defer, Observable, of } from 'rxjs';
import { mergeMap, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { CacheService } from '../../services/cache/cache.service';


@Injectable()
export class AuthenticatedInterceptor implements HttpInterceptor {
  constructor(private readonly cacheService: CacheService,
    private readonly authService: AuthService) { }
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      req.url.includes('/security/login') ||
      req.url.includes('/security/refresh-token') ||
      req.url.includes('assets') ||
      req.url.includes('http://ip-api.com/json') ||
      req.url.includes('/security/verifycode')

    ) {
      return next.handle(req);
    }
    return combineLatest([
      this.cacheService.getToken(),
      this.cacheService.getExpired()
    ]).pipe(
      take(1),
      mergeMap(([token, expired]) => {
        if (!token) {
          return next.handle(req);
        }

        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return defer(() =>
          isAfter(new Date(), expired as Date)
            ? this.authService //dispatch
              .retrieveTokenOnPageLoad()
              .pipe(switchMap(() => next.handle(cloned)))
            : next.handle(cloned)
        );
      })
    );
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthenticatedInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthenticatedInterceptor,
    multi: true,
  },
];
