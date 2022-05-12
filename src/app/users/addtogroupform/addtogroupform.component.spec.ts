import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtogroupformComponent } from './addtogroupform.component';

describe('AddtogroupformComponent', () => {
  let component: AddtogroupformComponent;
  let fixture: ComponentFixture<AddtogroupformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtogroupformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtogroupformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
