import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaComponent } from './area.component';
import { ChartComponent } from '../chart/chart.component';
import { ChartStub } from '../chart/chart.stub';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { ChartContainerStub } from '../chart-container/chart-container.stub';

describe('AreaComponent', () => {
  let component: AreaComponent;
  let fixture: ComponentFixture<AreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaComponent ],
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
    fixture = TestBed.createComponent(AreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
