import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BooleanPredicate, ColumnFilter } from '@blueriq/angular/lists';
import { FilterModule } from '../filter.module';
import { FilterCandidate } from '../types';

import { BooleanFilterComponent } from './boolean-filter.component';

describe('BooleanFilterComponent', () => {
  let component: BooleanFilterComponent;
  let fixture: ComponentFixture<BooleanFilterComponent>;
  const columnFilter: ColumnFilter = {} as ColumnFilter;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FilterModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BooleanFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('new boolean filter default shows true and unknown', (done) => {
    component.candidate = new FilterCandidate();
    fixture.detectChanges();
    fixture.whenStable()
    .then(() => {
      const checkOption = fixture.nativeElement.querySelector('option:checked');
      expect(checkOption.innerText).toBe('Only Yes');
      done();
    });

    const checkbox = fixture.nativeElement.querySelector('input[type=checkbox]');
    expect(checkbox.checked).toBe(true);
  });

  it('boolean filter with show true and false and unknown', (done) => {
    const filterCandidate = new FilterCandidate({
      column: columnFilter,
      predicate: { showFalse: true, showTrue: true, showUnknown: true } as BooleanPredicate,
    });
    component.candidate = filterCandidate;
    fixture.detectChanges();
    fixture.whenStable()
    .then(() => {
      const checkOption = fixture.nativeElement.querySelector('option:checked');
      expect(checkOption.innerText).toBe('Show Both');
      done();
    });

    const checkbox = fixture.nativeElement.querySelector('input[type=checkbox]');
    expect(checkbox.checked).toBe(true);
  });

  it('boolean filter with show false and not show unknown', (done) => {
    const filterCandidate = new FilterCandidate({
      column: columnFilter,
      predicate: { showFalse: true, showTrue: false, showUnknown: false } as BooleanPredicate,
    });
    component.candidate = filterCandidate;
    fixture.detectChanges();
    fixture.whenStable()
    .then(() => {
      const checkOption = fixture.nativeElement.querySelector('option:checked');
      expect(checkOption.innerText).toBe('Only No');
      done();
    });

    const checkbox = fixture.nativeElement.querySelector('input[type=checkbox]');
    expect(checkbox.checked).toBe(false);
  });

  it('boolean filter with show ony unknown', (done) => {
    const filterCandidate = new FilterCandidate({
      column: columnFilter,
      predicate: { showFalse: false, showTrue: false, showUnknown: true } as BooleanPredicate,
    });
    component.candidate = filterCandidate;
    fixture.detectChanges();
    fixture.whenStable()
    .then(() => {
      const checkOption = fixture.nativeElement.querySelector('option:checked');
      expect(checkOption.innerText).toBe('Show Neither');
      done();
    });

    const checkbox = fixture.nativeElement.querySelector('input[type=checkbox]');
    expect(checkbox.checked).toBe(true);
  });
});
