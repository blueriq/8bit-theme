import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FieldTemplate } from '@blueriq/core/testing';
import { FilterModule } from '../filter.module';
import { FilterCandidate } from '../types';

import { DomainFilterComponent } from './domain-filter.component';

describe('DomainFilterComponent', () => {
  let component: DomainFilterComponent;
  let fixture: ComponentFixture<DomainFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FilterModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DomainFilterComponent);
    component = fixture.componentInstance;
    // there is no DomainTemplate yet so we create a Domain via a FieldTemplate
    component.domain = FieldTemplate.text().domain({ one: 'een', two: 'twee', three: 'drie' }).build().domain;
    fixture.detectChanges();
  }));

  it('domain filter defaults should be one of and true', (done) => {
    component.candidate = new FilterCandidate();
    fixture.detectChanges();
    fixture.whenStable()
    .then(() => {
      const checkOption = fixture.nativeElement.querySelector('option:checked');
      expect(checkOption.innerText).toBe('One of');
      done();
    });

    const checkbox = fixture.nativeElement.querySelector('input[type=checkbox]');
    expect(checkbox.checked).toBe(true);
  });

});
