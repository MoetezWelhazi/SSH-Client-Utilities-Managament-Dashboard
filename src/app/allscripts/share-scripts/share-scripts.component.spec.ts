import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareScriptsComponent } from './share-scripts.component';

describe('SharescriptsComponent', () => {
  let component: ShareScriptsComponent;
  let fixture: ComponentFixture<ShareScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareScriptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
