import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AxisElementsComponent } from './axis-elements.component';
import { ChartComponent } from '../chart/chart.component';
import { ChartStub } from '../chart/chart.stub';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { ChartContainerStub } from '../chart-container/chart-container.stub';

describe('AxisElementsComponent', () => {
  let component: AxisElementsComponent;
  let fixture: ComponentFixture<AxisElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AxisElementsComponent ],
      providers:    [
        {
          provide: ChartComponent,
          useValue: new ChartStub()
        },
        {
          provide: ChartContainerComponent,
          useValue: new ChartContainerStub()
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AxisElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
