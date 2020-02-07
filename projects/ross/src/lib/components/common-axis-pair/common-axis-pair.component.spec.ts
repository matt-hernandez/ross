import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAxisPairComponent } from './common-axis-pair.component';

describe('CommonAxisPairComponent', () => {
  let component: CommonAxisPairComponent;
  let fixture: ComponentFixture<CommonAxisPairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonAxisPairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAxisPairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
