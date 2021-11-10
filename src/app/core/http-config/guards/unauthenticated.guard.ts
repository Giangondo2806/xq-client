import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map, skip, take, tap } from 'rxjs/operators';
import { CacheService } from '../../services/cache/cache.service';


@Injectable({ providedIn: 'root' })
export class UnauthenticatedGuard implements CanActivate {
  constructor(
    private readonly cacheService: CacheService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {

    return this.cacheService.getToken().pipe(
      tap(token=>{
        if(token)
        {
          this.router.navigateByUrl('/home');
        }
      }),
      map(token=>token===null)
    );

    // return new Observable(observer => {
    //   this.store.select(tokenSelector).pipe(take(1))
    //     .subscribe(() => {
    //       this.store.select(tokenSelector).pipe(
    //         tap((token) => {
    //           if (token)
    //             this.router.navigateByUrl('/course')
    //         })
    //       )
    //         .subscribe(hasToken => {
    //           observer.next(hasToken === null);
    //           observer.complete();
    //         })
    //     })
    // })


  }
}



// return this.store.select(tokenSelector).pipe(
//   take(1),
//   map((token) => token !== null),
//   tap((noToken) => {
//     if (!noToken) {
//       this.router.navigate(['/vocabulary']);
//     }
//   }),

// );
