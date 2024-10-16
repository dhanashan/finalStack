import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private auth: AuthService,
    private route:ActivatedRoute,
    private router:Router
    ){}
  
    signinform: FormGroup = new FormGroup({ 
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required])
    });
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        if (token) {
          this.verifyToken(token);
          console.log(token);
        }
      });
  
      const local_token = localStorage.getItem('token');
      if(local_token){
        this.router.navigate(['home/homepage']);
      }
    }
    verifyToken(token: string) {
      this.auth.checkToken(token).subscribe({
        next: (res:any)=>{
          if(res){
            alert(res.data+" ,"+res.message)
            this.router.navigate(['../signin']);
          }
          else{
            console.log('---------------------------')
            this.router.navigate(['../../not-found']);
          }
        }
      });
    }
    submitForm(){
      if(this.signinform.valid)
      {
        this.auth.signIn(this.signinform.value).subscribe({
          next: (res:any)=>{
            console.log(res);
            if(res.data.login){
              alert('Login Successfull')
              // Save JWT token to localStorage
              localStorage.setItem('token', res.data.val);
              
            }
            else{
              alert(res.data.val)
            }
          },
          error:(err)=>{
            console.error(err)
          },
          complete:()=> {
            this.router.navigate(['home/homepage'])
          }
  
        })
      }
    }
}
