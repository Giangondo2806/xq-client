import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fstat } from 'fs';
import { AuthService } from '../core/services/auth/auth.service';
import { ElectronService } from '../core/services/electron/electron.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private electronService: ElectronService,
    private authSerivice: AuthService

  ) { }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit(): void {
    this.electronService.ipcRenderer.send('loginScreen');

  }

  changeTheme(theme: 'default' | 'dark'): void {
    const dom = document.getElementById('dark-theme');
    if (theme === 'dark') {
      if (!dom) {
        const style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.id = 'dark-theme';
        style.href = 'assets/styles/dark.min.css';
        document.head.appendChild(style);
      }
    } else {
      dom.remove();
    }
  }

  login(): void {
    this.authSerivice.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(data=>{
      this.electronService.fs.writeFileSync('./cookie.txt', 'dddd');
    });
  }
}
