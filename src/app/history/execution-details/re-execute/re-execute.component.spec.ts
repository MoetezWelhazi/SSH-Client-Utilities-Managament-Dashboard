import { ComponentFixture, TestBed } from '@angular/core/testing';

import { reexecuteComponent } from './re-execute.component';

describe('ExecuteScriptComponent', () => {
  let component: reexecuteComponent;
  let fixture: ComponentFixture<reexecuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ reexecuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(reexecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
