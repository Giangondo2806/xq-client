import { Component, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { AuthService } from './core/services/auth/auth.service';
import { CookieService } from './core/services/cookie/cookie.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CacheService } from './core/services/cache/cache.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;
  constructor(
    private authService: AuthService,
    private electronService: ElectronService,
    private translate: TranslateService,
    private cookieSerivce: CookieService,
    private router: Router,
    private cacheService: CacheService
  ) {
    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }
  ngOnInit(): void {
    this.authService.retrieveTokenOnPageLoad()
      .pipe(tap((user) => {
        if (user) {
          this.router.navigateByUrl('/home');
        }
        this.loading = false;
      },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      )).subscribe(data => console.log(data));
  }
}
