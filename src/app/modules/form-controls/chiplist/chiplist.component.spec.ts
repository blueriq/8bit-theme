import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlueriqSessionTemplate, BlueriqTestingModule, BlueriqTestSession } from '@blueriq/angular/testing';
import { FieldTemplate } from '@blueriq/core/testing';
import { FormControlModule } from '../form-control.module';
import { ArrayValueTransformer } from './array-value-transformer';

import { ChiplistComponent } from './chiplist.component';

describe('ChiplistComponent without domain', () => {
  let fieldTemplate: FieldTemplate;
  let component: ChiplistComponent;
  let fixture: ComponentFixture<ChiplistComponent>;
  let session: BlueriqTestSession;

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
    fieldTemplate = FieldTemplate.text('colour').value(['Red', 'Green', 'Blue']);
    session = BlueriqSessionTemplate.create().build(fieldTemplate);
    fixture = session.get(ChiplistComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(fixture.nativeElement.querySelector('.nes-input').value).toBe('Red,Green,Blue');
  });

  it('should add a chip', () => {
    const inputField = fixture.nativeElement.querySelector('.nes-input');
    expect(inputField).toBeTruthy();

    // SUT
    inputField.value += ',Yellow';
    inputField.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // Verify
    expect(fixture.nativeElement.querySelector('.nes-input').value).toBe('Red,Green,Blue,Yellow');
  });

  it('should add a chip for float value', () => {
    fieldTemplate = FieldTemplate.currency('salary').value(['123.99', '234.50', '456.00']);
    session = BlueriqSessionTemplate.create().build(fieldTemplate);
    fixture = session.get(ChiplistComponent);
    component = fixture.componentInstance;

    const inputField = fixture.nativeElement.querySelector('.nes-input');
    expect(inputField).toBeTruthy();

    inputField.value += ',678.20';
    inputField.dispatchEvent(new Event('blur'));

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.nes-input').value).toBe('123.99,234.50,456.00,678.20');
  });

  it('should remove a chip', () => {
    spyOn(ArrayValueTransformer.prototype, 'toField').and.callThrough();
    const inputField = fixture.nativeElement.querySelector('.nes-input');
    expect(inputField).toBeTruthy();

    // SUT
    inputField.value = inputField.value.replace(',Green', '');
    inputField.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // Verify
    expect(fixture.nativeElement.querySelector('.nes-input').value).toBe('Red,Blue');
    expect(ArrayValueTransformer.prototype.toField).toHaveBeenCalled();
  });

  it('should not add an existing chip', () => {

    session.update(
      fieldTemplate.value(['Red', 'Green', 'Blue', 'Red']),
    );
    fixture.detectChanges();
    // inputField.value += ',RED';
    // inputField.dispatchEvent(new Event('blur'));
    expect(fixture.nativeElement.querySelector('.nes-input').value).toBe('Red,Green,Blue');
  });

});
