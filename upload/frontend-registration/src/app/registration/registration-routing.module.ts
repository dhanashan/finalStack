import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotComponent } from './forgot/forgot.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path:'signin', component:LoginComponent
  },
  {
    path:'signup', component:SignupComponent
  },
  {
    path:'forgotpass', component:ForgotComponent
  },
  // {
  //   path:'resetpass', component:ResetpassComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
