import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule,ButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupform:FormGroup; 
  constructor(private fb:FormBuilder, private auth:AuthService)
    {
    this.signupform = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      confirmPassword: new FormControl('', Validators.required)
    })
  }



  verifyMail(){
    if(this.signupform.valid)
    {
      // console.log(this.signupform.value);
      if(this.signupform.value.password===this.signupform.value.confirmPassword)
      {
        this.auth.register(this.signupform.value).subscribe({
          next:(res: any)=>{
            alert(res.message);
          },
          error: (err)=>{
            console.error("Registration Failed");
          }
        })
      }
      else{
        alert("Password and Confirm password are not same !");
      }
    }
  }
}
