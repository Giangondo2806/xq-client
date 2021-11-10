import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { CacheService } from '../../services/cache/cache.service';


@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly cacheService: CacheService,
    private readonly router: Router) { }

  canActivate(): Observable<boolean> {

    return this.cacheService.getToken().pipe(
      tap(token => {
        if (!token) {
          this.router.navigateByUrl('/account');
        }
      }),
      map(token => !!token)
    );
    // return new Observable(observer => {
    //   this.store.select(tokenStateSelector)
    //     .subscribe(() => {
    //       this.store.select(tokenStateSelector).pipe(
    //         take(1),
    //         tap((tokenState) => {
    //           if (tokenState === 'error')
    //             this.router.navigateByUrl('/ohayo/welcome')
    //         })
    //       )
    //         .subscribe(hasToken => {
    //           observer.next(hasToken !== 'error');
    //           observer.complete();
    //         })
    //     })
    // })
  }
}
