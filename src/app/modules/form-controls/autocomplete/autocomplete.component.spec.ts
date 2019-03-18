import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlueriqSessionTemplate, BlueriqTestingModule, BlueriqTestSession } from '@blueriq/angular/testing';
import { FieldTemplate } from '@blueriq/core/testing';
import { BqPresentationStyles } from '../../BqPresentationStyles';
import { FormControlModule } from '../form-control.module';
import { AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let field: FieldTemplate;
  let session: BlueriqTestSession;
  let component: ComponentFixture<AutocompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        BlueriqTestingModule,
        FormControlModule,
      ],
    });
  });

  beforeEach(() => {
    field = FieldTemplate.text('colour').styles(BqPresentationStyles.AUTOCOMPLETE).domain({
      'a': 'Red',
      'b': 'White',
      'c': 'Blue',
      'd': 'Orange',
    });
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(AutocompleteComponent);
  });

  it('should be disabled', () => {
    let autocompleteInput = component.nativeElement.querySelector('input');
    expect(autocompleteInput.hasAttribute('disabled')).toBe(false);

    field.styles(BqPresentationStyles.AUTOCOMPLETE, BqPresentationStyles.DISABLED);
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(AutocompleteComponent);

    autocompleteInput = component.nativeElement.querySelector('input');
    expect(autocompleteInput.hasAttribute('disabled')).toBe(true);
  });

  it('should be read only', () => {
    let autocompleteInput = component.nativeElement.querySelector('input');
    expect(autocompleteInput.hasAttribute('disabled')).toBe(false);

    field.readonly(true);
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(AutocompleteComponent);

    autocompleteInput = component.nativeElement.querySelector('input');
    expect(autocompleteInput.hasAttribute('disabled')).toBe(true);
  });

  it('should have a hint', () => {
    session.update(
      field.explainText('explaining it'),
    );
    expect(component.nativeElement.querySelector('.hint')).toBeTruthy();
    expect(component.nativeElement.querySelector('.hint').innerHTML).toContain('explaining it');
  });

  it('should have a placeholder', () => {
    session.update(
      field.placeholder('myPlaceholder'),
    );
    const autocompleteInput = component.nativeElement.querySelector('input');
    expect(autocompleteInput.getAttribute('placeholder')).toBe('myPlaceholder');
  });

  it('should have a error', () => {
    expect(component.nativeElement.querySelector('.error')).toBeFalsy();
    component.componentInstance.formControl.markAsTouched();
    component.detectChanges();
    session.update(
      field.required(true),
      field.error('wrong IBAN'),
    );
    expect(component.nativeElement.querySelector('.error')).toBeTruthy();
  });

  it('should display value when fieldValue set', () => {
    let autocompleteInput = component.nativeElement.querySelector('input');
    expect(autocompleteInput.value).toBe('');

    session.update(
      field.value('c'),
    );

    component.whenStable()
    .then(() => {
      component.detectChanges();
      autocompleteInput = component.nativeElement.querySelector('input');
      expect(autocompleteInput.value).toBe('Blue');
    });
  });

  it('should set fieldValue when option clicked', () => {
    changeInputValue('e');

    const autocompleteOptions = getAutocompletedValues();
    expect(autocompleteOptions).toBeTruthy();
    autocompleteOptions[1].click();

    // Verify
    expect(component.componentInstance.field.getValue()).toBe('b');
  });

  it('initially should contain all domain values in autocomplete', () => {
    changeInputValue('');

    const autocompleteOptions = getAutocompletedValues();

    // Verify
    expect(autocompleteOptions.length).toBe(4);
    expect(autocompleteOptions[0].textContent).toContain('Red');
    expect(autocompleteOptions[1].textContent).toContain('White');
    expect(autocompleteOptions[2].textContent).toContain('Blue');
    expect(autocompleteOptions[3].textContent).toContain('Orange');
  });

  it('should contain correct options for filter input', () => {
    changeInputValue('r');

    const autocompleteOptions = getAutocompletedValues();

    // Verify
    expect(autocompleteOptions.length).toBe(2);
    expect(autocompleteOptions[0].textContent).toContain('Red');
    expect(autocompleteOptions[1].textContent).toContain('Orange');
  });

  it('should set fieldValue when part of domain value typed and clicked', () => {
    changeInputValue('bl');

    const autocompleteOptions = getAutocompletedValues();
    expect(autocompleteOptions).toBeTruthy();
    // Click on the 'Blue' option
    autocompleteOptions[0].click();

    // Verify
    // The technical value for 'Blue' is 'c'
    expect(component.componentInstance.field.getValue()).toBe('c');
  });

  it('should remain the value on correct input', () => {
    // Leave the input with white as input, which as an existing domain value
    const input = changeInputValue('White', 'blur');

    // Verify
    expect(input.value).toBe('White');
  });

  it('should clear the value on incorrect input', () => {
    const input = changeInputValue('ThisIsNotAColor', 'blur');

    // Verify
    expect(input.value).toBe('');
  });

  it('should reset input value when the value is not within the domain', () => {
    const autocompleteInput = changeInputValue('something_not_in_the_domain', 'blur');

    const autocompleteOptions = getAutocompletedValues();
    expect(autocompleteOptions).toBeTruthy();

    // Verify
    // all options are filtered out
    expect(autocompleteOptions.length).toEqual(0);
    // the field value is still empty
    expect(component.componentInstance.field.getValue()).toEqual('');
    // the input value is reset
    expect(autocompleteInput.value).toEqual('');
  });

  function changeInputValue(value, eventType = 'input') {
    const autocompleteInput = component.nativeElement.querySelector('input');
    autocompleteInput.focus();
    autocompleteInput.value = value;
    autocompleteInput.dispatchEvent(new Event(eventType));
    component.detectChanges();
    return autocompleteInput;
  }

  function getAutocompletedValues(): NodeListOf<any> {
    const autocompleteContent = component.debugElement.query(By.css('.autocomplete')).nativeElement;
    return autocompleteContent.querySelectorAll('p');
  }

});
