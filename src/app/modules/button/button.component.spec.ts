import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlueriqCommonModule } from '@blueriq/angular';
import { BlueriqSessionTemplate, BlueriqTestingModule, BlueriqTestSession } from '@blueriq/angular/testing';
import { ButtonTemplate } from '@blueriq/core/testing';
import { BqPresentationStyles } from '../BqPresentationStyles';
import { ButtonComponent } from './button.component';
import { ButtonModule } from './button.module';

describe('ButtonComponent', () => {
  let button: ButtonTemplate;
  let component: ComponentFixture<ButtonComponent>;
  let session: BlueriqTestSession;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        BlueriqTestingModule,
        BlueriqCommonModule,
        FormsModule,
        ButtonModule,
      ],
    });
  }));

  beforeEach(() => {
    button = ButtonTemplate.create();
    button.caption('Click me!');
    session = BlueriqSessionTemplate.create().build(button);
    component = session.get(ButtonComponent);
  });

  it('should display the button text', () => {
    const buttonText: string = component.nativeElement.querySelector('.nes-btn').textContent.trim();
    expect(buttonText).toBe('Click me!');

  });

  it('should be disabled', () => {
    let disabledAttributePresent = component.nativeElement.querySelector('button').hasAttribute('disabled');
    expect(disabledAttributePresent).toBeFalsy();

    // Disable
    session.update(
      button.disabled(true),
    );
    disabledAttributePresent = component.nativeElement.querySelector('button').hasAttribute('disabled');
    expect(disabledAttributePresent).toBeTruthy();
  });

  it('should be basic colored', () => {
    session.update(
      button.styles(),
    );

    const classes: string = component.nativeElement.querySelector('button').getAttribute('class');
    expect(classes).toContain('is-default');
    expect(classes).not.toContain('is-primary');
    expect(classes).not.toContain('is-warning');
  });

  it('should be primary colored', () => {
    session.update(
      button.styles(BqPresentationStyles.PRIMARY),
    );

    const classes: string = component.nativeElement.querySelector('button').getAttribute('class');
    expect(classes).toContain('is-primary');
    expect(classes).not.toContain('is-default');
  });

  it('should be secondary colored', () => {
    session.update(
      button.styles(BqPresentationStyles.ACCENT),
    );

    const classes: string = component.nativeElement.querySelector('button').getAttribute('class');
    expect(classes).toContain('is-success');
    expect(classes).not.toContain('is-default');
  });

  it('should be tertiary colored', () => {
    session.update(
      button.styles(BqPresentationStyles.TERTIARY),
    );

    const classes: string = component.nativeElement.querySelector('button').getAttribute('class');
    expect(classes).toContain('is-warning');
    expect(classes).not.toContain('is-default');
  });

  it('should use the bqbutton directive', () => {
    // Verify
    expect(component.nativeElement.querySelector('button[bqbutton]')).toBeTruthy();
  });

});
