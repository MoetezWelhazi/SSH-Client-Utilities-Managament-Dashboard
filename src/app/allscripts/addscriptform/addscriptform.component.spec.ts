import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddscriptformComponent } from './addscriptform.component';

describe('AddscriptComponent', () => {
  let component: AddscriptformComponent;
  let fixture: ComponentFixture<AddscriptformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddscriptformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddscriptformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
