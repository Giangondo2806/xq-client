import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInformationVm } from '../api-client/api.client';

@Injectable({ providedIn: 'root' })
export class CacheService {
    private $user: BehaviorSubject<any> = new BehaviorSubject(null);
    private $token: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private $expired: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
    private $loadState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    public setUser(user: UserInformationVm) {
        this.$user.next(user);
    }

    public getUser(): Observable<UserInformationVm> {
        return this.$user;
    }

    public setToken(token: string): void {
        this.$token.next(token);
    }

    public getToken(): Observable<string> {
        return this.$token;
    }

    public setExpired(token: Date): void {
        this.$expired.next(token);
    }

    public getExpired(): Observable<Date> {
        return this.$expired;
    }

    public setLoadState(state: boolean) {
        this.$loadState.next(state);
    }

    public getLoadState(): Observable<boolean> {
        return this.$loadState;
    }




}
