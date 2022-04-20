import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllscriptsComponent } from './allscripts.component';

describe('AllscriptsComponent', () => {
  let component: AllscriptsComponent;
  let fixture: ComponentFixture<AllscriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllscriptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllscriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
