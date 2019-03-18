import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlueriqSessionTemplate, BlueriqTestingModule, BlueriqTestSession } from '@blueriq/angular/testing';
import { FieldTemplate } from '@blueriq/core/testing';
import { BqPresentationStyles } from '../../BqPresentationStyles';
import { FormControlModule } from '../form-control.module';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let field: FieldTemplate;
  let session: BlueriqTestSession;
  let component: ComponentFixture<SelectComponent>;

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
    field = FieldTemplate.text('colour').domain({
      'blue': 'Blue',
      'pink': 'Pink',
      'white': 'White',
    });
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(SelectComponent);
    component.autoDetectChanges();
  });

  it('should be disabled', () => {
    let selectDisabled = component.nativeElement.querySelector('select[disabled]');
    expect(selectDisabled).toBeFalsy();

    field.styles(BqPresentationStyles.DISABLED);
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(SelectComponent);

    selectDisabled = component.nativeElement.querySelector('select[disabled]');
    expect(selectDisabled).toBeTruthy();
  });

  it('should be read only', () => {
    let selectReadonly = component.nativeElement.querySelector('select[disabled]');
    expect(selectReadonly).toBeFalsy();

    field.readonly(true);
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(SelectComponent);

    selectReadonly = component.nativeElement.querySelector('select[disabled]');
    expect(selectReadonly).toBeTruthy();
  });

  it('should have a hint', () => {
    field.explainText('explaining it');
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(SelectComponent);

    expect(component.nativeElement.querySelector('.hint')).toBeTruthy();
    expect(component.nativeElement.querySelector('.hint').innerHTML).toContain('explaining it');
  });

  it('should have a placeholder', () => {
    field.placeholder('myPlaceholder');
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(SelectComponent);

    expect(component.nativeElement.querySelector('option')).toBeTruthy();
    expect(component.nativeElement.querySelector('option').innerHTML).toBe('myPlaceholder');
  });

  it('should have a error', () => {
    expect(component.nativeElement.querySelector('.error')).toBeFalsy();
    session.update(
      field.required(true),
      field.error('wrong IBAN'),
      field.explainText('leg maar uit'),
    );
    component.detectChanges();
    expect(component.nativeElement.querySelector('.error').innerText).toBe('wrong IBAN');
  });

  it('should select one value', () => {
    let checkOption = component.nativeElement.querySelector('option:checked');
    expect(checkOption).toBeNull();

    session.update(
      field.value('blue'),
    );

    checkOption = component.nativeElement.querySelector('option:checked');
    expect(checkOption.innerText.trim()).toBe('Blue');
  });

  it('should only have one select', () => {
    const selectList = component.nativeElement.querySelectorAll('select') as NodeListOf<HTMLElement>;
    expect(selectList.length).toBe(1);
  });

  it('should have more values selected', (done) => {
    let selectedMoreValues = component.nativeElement.querySelector('select').getAttribute('ng-reflect-value');
    expect(selectedMoreValues).toBeNull();

    field.value(['pink', 'white']);
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(SelectComponent);

    component.whenStable()
    .then(() => {
      component.detectChanges();
      selectedMoreValues = component.nativeElement.querySelectorAll('option:checked');
      expect(selectedMoreValues.length).toBe(2);
      expect(selectedMoreValues[0].innerText).toBe('Pink');
      expect(selectedMoreValues[1].innerText).toBe('White');
      done();
    });
  });

  it('should contain all options in select', () => {
    const selectOptions = component.nativeElement.querySelectorAll('option');

    // Verify
    expect(selectOptions.length).toBe(4);
    expect(selectOptions[0].getAttribute('ng-reflect-value')).toBe(null);
    expect(selectOptions[1].getAttribute('ng-reflect-value')).toBe('blue');
    expect(selectOptions[2].getAttribute('ng-reflect-value')).toBe('pink');
    expect(selectOptions[3].getAttribute('ng-reflect-value')).toBe('white');
  });

});


