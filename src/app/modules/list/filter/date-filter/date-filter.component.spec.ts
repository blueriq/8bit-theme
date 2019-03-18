import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlueriqSession } from '@blueriq/angular';
import { LocalizationTemplate } from '@blueriq/core/testing';
import { FilterModule } from '../filter.module';
import { FilterCandidate } from '../types';

import { DateFilterComponent } from './date-filter.component';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;

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

    fixture = TestBed.createComponent(DateFilterComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    component.candidate = new FilterCandidate();
    fixture.detectChanges();
  }));

  it('new date filter default shows on and unknown', (done) => {
    fixture.whenStable()
    .then(() => {
      const checkOption = fixture.nativeElement.querySelector('option:checked');
      expect(checkOption.innerText).toBe('On');
      done();
    });

    const checkbox = fixture.nativeElement.querySelector('input[type=checkbox]');
    expect(checkbox.checked).toBe(true);
  });

});
