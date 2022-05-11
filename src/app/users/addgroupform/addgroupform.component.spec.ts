import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgroupformComponent } from './addgroupform.component';

describe('AddgroupformComponent', () => {
  let component: AddgroupformComponent;
  let fixture: ComponentFixture<AddgroupformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddgroupformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgroupformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
