import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOwnerComponent } from './remove-owner.component';

describe('RemoveOwnerComponent', () => {
  let component: RemoveOwnerComponent;
  let fixture: ComponentFixture<RemoveOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
