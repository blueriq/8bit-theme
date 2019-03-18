import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NumericOperator } from '@blueriq/angular/lists';
import { FilterModule } from '../filter.module';
import { FilterCandidate } from '../types';

import { NumericFilterComponent } from './numeric-filter.component';

describe('NumericFilterComponent', () => {
  let component: NumericFilterComponent;
  let fixture: ComponentFixture<NumericFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FilterModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(NumericFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('default filter is equals and show unknown', (done) => {
    component.candidate = new FilterCandidate();
    fixture.detectChanges();
    fixture.whenStable()
    .then(() => {
      const checkOption = fixture.nativeElement.querySelector('option:checked');
      expect(checkOption.innerText).toBe('Equal to');
      done();
    });
    expect(component.operator).toBe(NumericOperator.Equals, 'default value should be set to equal');

    const checkbox = fixture.nativeElement.querySelector('input[type=checkbox]');
    expect(checkbox.checked).toBe(true);
  });

});
