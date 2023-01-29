import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule],
  declarations: [AuthModalComponent, LoginComponent, RegisterComponent],
  // we are exporting component so appmodule will see it
  exports: [AuthModalComponent],
})
export class UserModule {}
