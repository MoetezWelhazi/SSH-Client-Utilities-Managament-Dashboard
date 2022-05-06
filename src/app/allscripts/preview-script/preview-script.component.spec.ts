import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewScriptComponent } from './preview-script.component';

describe('PreviewScriptComponent', () => {
  let component: PreviewScriptComponent;
  let fixture: ComponentFixture<PreviewScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewScriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
