import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyScriptsComponent } from './my-scripts.component';

describe('ScriptsComponent', () => {
  let component: MyScriptsComponent;
  let fixture: ComponentFixture<MyScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyScriptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
