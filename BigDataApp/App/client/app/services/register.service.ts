import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { User } from  './../models/user.model';
 
@Injectable()
export class RegsiterService {
 
    constructor(private http: Http){
 
    }
     
    registerUser(user:User){
        return this.http.post('http://localhost:4500/api/register',{
            username : user.username,
            password : user.password
        })
    }
 
}