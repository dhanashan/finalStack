import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }

  apiUrl:string = 'http://localhost:3000/user/register';

  register(payload:any){
    console.log(payload)
    return this.http.post(this.apiUrl, payload);
  }

  checkToken(token:string){
    console.log(token);
    return this.http.post('http://localhost:3000/user/verify/',{tok:token})
  }

  signIn(payload:any){
    return this.http.post('http://localhost:3000/user/signin',payload)
  }

  forgotPass(payload:any){
    return this.http.post('http://localhost:3000/user/forgotpass', payload)
  }

  checKResetPassToken(payload:any){
    return this.http.post('http://localhost:3000/user/verifyresettoken',payload);
  }

}
