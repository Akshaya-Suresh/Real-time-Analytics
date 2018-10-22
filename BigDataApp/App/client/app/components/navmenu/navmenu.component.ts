import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'nav-menu',
    templateUrl: 'navmenu.component.html',
    styleUrls: ['navmenu.component.css']
})
export class NavMenuComponent {
    show:boolean = false;
  toggleNavbar() {
    this.show = !this.show
  }
}
