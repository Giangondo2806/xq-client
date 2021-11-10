import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
}
