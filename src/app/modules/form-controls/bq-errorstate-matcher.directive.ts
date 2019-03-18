import { Directive, forwardRef } from '@angular/core';
import { FormControl, FormGroupDirective, NG_VALIDATORS, NgForm } from '@angular/forms';
import { getFieldMessages } from '@blueriq/angular/forms';

/**
 * This ErrorStateMatcher determines that a field is in an error state when:
 * * the field is invalid and it is touched, or
 * * the field is invalid and the form in which the field is included is submitted, or
 * * the field contains Blueriq validation messages
 */
@Directive({
  selector: '[bqValidate][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => BqErrorstateMatcherDirective), multi: true },
  ],
})
export class BqErrorstateMatcherDirective {

  validate(control: FormControl | null, form: FormGroupDirective | NgForm | null) {
    return !!(control && (
        (
          control.invalid &&
          (control.touched || (form && form.submitted))
        ) ||
        getFieldMessages(control).hasErrors)
    );
  }

}
