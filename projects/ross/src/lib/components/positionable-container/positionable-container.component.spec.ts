import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionableContainerComponent } from './positionable-container.component';

describe('PositionableContainerComponent', () => {
  let component: PositionableContainerComponent;
  let fixture: ComponentFixture<PositionableContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionableContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
