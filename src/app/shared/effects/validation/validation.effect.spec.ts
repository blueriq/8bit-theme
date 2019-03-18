import { async, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InvalidFormAction } from '@blueriq/angular/forms';
import { provideMockActions } from '@ngrx/effects/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { ValidationEffect } from './validation.effect';

describe('ValidationEffect', () => {
  let actions: Subject<any>;
  let effects: ValidationEffect;

  beforeEach(async(() => {
    spyOn(ToastrService.prototype, 'error').and.callThrough();
    spyOn(ToastrService.prototype, 'warning').and.callThrough();
    actions = new Subject();

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        ValidationEffect,
        provideMockActions(() => actions),
      ],
    });

    effects = TestBed.get(ValidationEffect);
  }));

  describe('errors', () => {
    it('opens toastr with an error message', () => {
      const action = new InvalidFormAction('Main', true, false, 'There are validation errors on the page');

      effects.invalidForm$.subscribe();
      actions.next(action);

      // Verify
      expect(ToastrService.prototype.error).toHaveBeenCalledWith('There are validation errors on the page', 'ERROR', {
        timeOut: 5000,
        positionClass: 'toast-bottom-full-width',
      });
    });

    it('opens toastr with an error message when no message is present', () => {
      const action = new InvalidFormAction('Main', true, false, undefined);

      effects.invalidForm$.subscribe();
      actions.next(action);

      // Verify
      expect(ToastrService.prototype.error).toHaveBeenCalledWith(undefined, 'ERROR', {
        timeOut: 5000,
        positionClass: 'toast-bottom-full-width',
      });
    });
  });

  describe('warnings', () => {
    it('opens toastr with a warning message', () => {
      const action = new InvalidFormAction('Main', false, true, 'There are validation warnings on the page');

      effects.invalidForm$.subscribe();
      actions.next(action);

      // Verify
      expect(ToastrService.prototype.warning).toHaveBeenCalledWith('There are validation warnings on the page', 'WARNING', {
        timeOut: 5000,
        positionClass: 'toast-bottom-full-width',
      });
    });

    it('opens toastr with a warning message when no message is present', () => {
      const action = new InvalidFormAction('Main', false, true, undefined);

      effects.invalidForm$.subscribe();
      actions.next(action);

      // Verify
      expect(ToastrService.prototype.warning).toHaveBeenCalledWith(undefined, 'WARNING', {
        timeOut: 5000,
        positionClass: 'toast-bottom-full-width',
      });
    });
  });

  it('does not do anything when no errors or warnings', () => {
    const action = new InvalidFormAction('Main', false, false, 'There are validation warnings on the page');

    effects.invalidForm$.subscribe();
    actions.next(action);

    // Verify
    expect(ToastrService.prototype.error).not.toHaveBeenCalled();
    expect(ToastrService.prototype.warning).not.toHaveBeenCalled();
  });

});
