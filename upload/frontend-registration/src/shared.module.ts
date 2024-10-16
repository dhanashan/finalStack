import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink, 
    ReactiveFormsModule,
    HttpClientModule,
    RouterOutlet,
    MessageModule,
    CardModule
  ],
  exports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
    ReactiveFormsModule,
    RouterOutlet,
    MessageModule,
    CardModule
  ],
  providers:[

  ]
})
export class SharedModule { }
