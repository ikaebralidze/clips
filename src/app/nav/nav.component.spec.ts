/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { NavComponent } from './nav.component';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const mockAuthService = jasmine.createSpyObj(
    'AuthService',
    ['createUser', 'logout'],
    {
      isAuthed$: of(true),
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should logout', () => {
    const element = fixture.debugElement.query(By.css('ul:nth-child(2) li a'));

    expect(element).withContext('not loged in ').toBeTruthy();

    element.triggerEventHandler('click');

    const service = TestBed.inject(AuthService);

    expect(service.logout)
      .withContext('colud not click logout link')
      .toHaveBeenCalledTimes(1);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
