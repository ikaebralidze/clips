import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/EmailTaken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  name = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  email = new UntypedFormControl(
    '',
    [Validators.required, Validators.email],
    [this.emailTaken.validate]
  );

  age = new UntypedFormControl(null, [
    Validators.required,
    Validators.min(14),
    Validators.max(120),
  ]);

  password = new UntypedFormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);

  confirm_password = new UntypedFormControl('', [Validators.required]);

  phoneNumber = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(9),
    Validators.maxLength(9),
  ]);

  showAlert = false;
  alertMsg = 'Please wait! your account is being created';
  alertColor = 'blue';
  inSubmission = false;

  registerForm = new UntypedFormGroup(
    {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
      confirm_password: this.confirm_password,
      phoneNumber: this.phoneNumber,
    },
    [RegisterValidators.match('password', 'confirm_password')]
  );

  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! your account is being created';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.createUser(this.registerForm.value as IUser);
    } catch (e) {
      console.error(e);

      this.alertMsg = 'An unexpected error occurred';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMsg = 'Success! You account has been created.';
    this.alertColor = 'green';
  }
}
