import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {

  constructor(private auth:AuthService){}

  forgotpassform: FormGroup = new FormGroup({ 
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submitForm(){
    if(this.forgotpassform.valid)
    {
      this.auth.forgotPass(this.forgotpassform.value).subscribe({
        next:(res:any)=>{
          alert(res.data);
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
  }
}
