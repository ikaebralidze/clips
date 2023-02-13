import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabComponent } from './tab.component';

describe('Tab Component', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should have .hidden class', () => {
    // it's better to use debugElement
    const element = fixture.debugElement.query(By.css('.hidden'));

    const element2 = fixture.nativeElement.querySelector('.hidden');
    const element3 = document.querySelector('.hidden');

    expect(element).toBeTruthy();
  });

  it('Should not have .hidden class', () => {
    component.active = true;
    fixture.detectChanges();
    // it's better to use debugElement
    const element = fixture.debugElement.query(By.css('.hidden'));

    const element2 = fixture.nativeElement.querySelector('.hidden');
    const element3 = document.querySelector('.hidden');
    // not is same as toBeFalsy()
    expect(element).not.toBeTruthy();
  });
});
