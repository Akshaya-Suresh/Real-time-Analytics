import { Component } from '@angular/core';
import { LoginService } from './../../services/login.service';
import { User } from './../../models/user.model';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],
    providers: [ LoginService ]
  })
export class LoginComponent {
    public user : User; 
 
  constructor(private loginService: LoginService,public router: Router) {
      this.user = new User();
  }
 
  validateLogin() {
    if(this.user.username && this.user.password) {
      console.log(this.user)
        this.loginService.validateLogin(this.user).subscribe(result => {
        console.log('result is ', result);
        this.router.navigate(['/home']);
        
      }, error => {
        console.log('error is ', error);
      });
    } else {
        alert('enter user name and password');
    }
  }
}