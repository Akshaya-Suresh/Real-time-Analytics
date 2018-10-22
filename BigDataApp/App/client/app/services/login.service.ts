import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { User } from  './../models/user.model';
 
@Injectable()
export class LoginService {
 
    constructor(private http: Http){
 
    }
     
    validateLogin(user:User){
        return this.http.post('http://localhost:4500/api/login',{
            username : user.username,
            password : user.password
        })
    }
 
}