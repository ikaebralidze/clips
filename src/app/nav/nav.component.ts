import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  isAuthed = false;

  constructor(public modal: ModalService, public auth: AuthService) {}

  openModal(event: Event) {
    event.preventDefault();

    this.modal.toggleModal('auth');
  }

  logout(event: Event) {
    this.auth.logout(event);
  }
  ngOnInit() {}
}
