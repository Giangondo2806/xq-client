import { Injectable } from '@angular/core';
import { ElectronService } from '..';

@Injectable({ providedIn: 'root' })
export class CookieService {
    constructor(private readonly electronService: ElectronService) {
    }

    setCookie(cookie: string): void {
        this.electronService.fs.writeFileSync('session.txt', cookie);
    }
    getCookie(): string {
        return this.electronService.fs.readFileSync('session.txt', {
            encoding: 'utf-8'
        });
    }

}
