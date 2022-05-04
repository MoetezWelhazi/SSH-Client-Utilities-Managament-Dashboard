import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionDetailsComponent } from './execution-details.component';

describe('ExecutionDetailsComponent', () => {
  let component: ExecutionDetailsComponent;
  let fixture: ComponentFixture<ExecutionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
