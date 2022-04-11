import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptsListComponent } from './scripts-list.component';

describe('ScriptsListComponent', () => {
  let component: ScriptsListComponent;
  let fixture: ComponentFixture<ScriptsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
