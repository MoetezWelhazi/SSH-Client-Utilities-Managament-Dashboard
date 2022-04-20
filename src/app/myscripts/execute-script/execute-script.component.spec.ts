import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteScriptComponent } from './execute-script.component';

describe('ExecuteScriptComponent', () => {
  let component: ExecuteScriptComponent;
  let fixture: ComponentFixture<ExecuteScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecuteScriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
