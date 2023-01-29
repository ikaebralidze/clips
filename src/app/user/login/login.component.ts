import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };

  showAlert = false;
  alertMessage = 'please wait for login!';
  color = 'blue';
  inSubmistion = false;

  constructor(public auth: AngularFireAuth) {}

  async login() {
    this.showAlert = true;
    this.alertMessage = 'please wait for login!';
    this.color = 'blue';
    this.inSubmistion = true;
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (e) {
      this.alertMessage = 'Credentials is incorect';
      this.color = 'red';
      this.inSubmistion = false;
      return;
    }
    this.color = 'green';
    this.alertMessage = 'you are logged in';
  }

  ngOnInit(): void {}
}
