import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlueriqSession } from '@blueriq/angular';
import { ColumnFilter } from '@blueriq/angular/lists';
import { FieldTemplate, LocalizationTemplate } from '@blueriq/core/testing';
import { BooleanFilterComponent } from '../boolean-filter/boolean-filter.component';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { DomainFilterComponent } from '../domain-filter/domain-filter.component';
import { EmptyFilterComponent } from '../empty-filter/empty-filter.component';
import { FilterModule } from '../filter.module';
import { NumericFilterComponent } from '../numeric-filter/numeric-filter.component';
import { TextFilterComponent } from '../text-filter/text-filter.component';
import { FilterCandidate } from '../types';

import { FilterRowComponent } from './filter-row.component';

describe('FilterRowComponent', () => {
  let component: FilterRowComponent;
  let fixture: ComponentFixture<FilterRowComponent>;

  beforeEach(async(() => {
    const session = { localization: LocalizationTemplate.create().build() } as BlueriqSession;
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FilterModule,
      ],
      providers: [
        { provide: BlueriqSession, useValue: session },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FilterRowComponent);
    component = fixture.componentInstance;

    const columns: ColumnFilter[] = [
      { type: 'boolean', title: 'boolean' } as ColumnFilter,
      { type: 'date', title: 'date' } as ColumnFilter,
      { type: 'datetime', title: 'datetime' } as ColumnFilter,
      { type: 'domain', title: 'domain', domain: FieldTemplate.text().domain({}).build().domain } as ColumnFilter,
      { type: 'text', title: 'text' } as ColumnFilter,
      { type: 'number', title: 'number' } as ColumnFilter,
    ];
    component.currentColumns = columns;
    component.candidate = new FilterCandidate();

    fixture.detectChanges();
  }));

  it('should display a emptyfilter by default', () => {
    const emptyComponent = fixture.debugElement.query(By.directive(EmptyFilterComponent));
    expect(emptyComponent).toBeTruthy();
  });

  it('select boolean', () => {
    selectColumn('boolean');
    expect(fixture.debugElement.query(By.directive(BooleanFilterComponent))).toBeTruthy();
    expect(component.candidate.predicate!.type).toBe('boolean');
  });

  it('select date', () => {
    selectColumn('date');
    expect(fixture.debugElement.query(By.directive(DateFilterComponent))).toBeTruthy();
    expect(component.candidate.predicate!.type).toBe('date');
  });

  it('select datetime', () => {
    selectColumn('datetime');
    expect(fixture.debugElement.query(By.directive(DateFilterComponent))).toBeTruthy();
    expect(component.candidate.predicate!.type).toBe('date');
  });

  it('select domain', () => {
    selectColumn('domain');
    expect(fixture.debugElement.query(By.directive(DomainFilterComponent))).toBeTruthy();
    expect(component.candidate.predicate!.type).toBe('domain');
  });

  it('select number', () => {
    selectColumn('number');
    expect(fixture.debugElement.query(By.directive(NumericFilterComponent))).toBeTruthy();
    expect(component.candidate.predicate!.type).toBe('numeric');
  });

  it('select text', () => {
    selectColumn('text');
    expect(fixture.debugElement.query(By.directive(TextFilterComponent))).toBeTruthy();
    expect(component.candidate.predicate!.type).toBe('text');
  });

  function selectColumn(type: string): void {
    const index = component.currentColumns.findIndex(column => column.type === type);
    const select = fixture.nativeElement.querySelector('select');
    select.selectedIndex = index + 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }
});
