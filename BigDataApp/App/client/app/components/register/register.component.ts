import { Component } from '@angular/core';
import { RegsiterService } from './../../services/register.service';
import { User } from './../../models/user.model';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css'],
    providers: [ RegsiterService ]
  })
export class RegisterComponent {
    public user : User; 
 
  constructor(private registerService: RegsiterService,public router: Router) {
      this.user = new User();
  }
 
  regidterUser() {
    if(this.user.username && this.user.password) {
      console.log(this.user)
        this.registerService.registerUser(this.user).subscribe(result => {
        console.log('result is ', result);
        this.router.navigate(['/login']);
        
      }, error => {
        console.log('error is ', error);
      });
    } else {
        alert('enter user name and password');
    }
  }
}