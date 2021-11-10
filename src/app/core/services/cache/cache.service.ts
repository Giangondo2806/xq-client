import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CacheService {
    private $user: BehaviorSubject<any> = new BehaviorSubject(null);
    private $token: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public setUser(user: any) {
        this.$user.next(user);
    }

    public getUser(): any {
        return this.$user;
    }

    public setToken(token: string): void {
        this.$token.next(token);
    }

    public getToken(): BehaviorSubject<string> {
        return this.$token;
    }

}
