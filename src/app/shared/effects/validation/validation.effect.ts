import { Injectable } from '@angular/core';
import { ButtonPressHandledAction } from '@blueriq/angular';
import { FormActions, InvalidFormAction } from '@blueriq/angular/forms';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ValidationEffect {

  @Effect({ dispatch: false })
  invalidForm$: Observable<any> = this.actions$.pipe(
    ofType<ButtonPressHandledAction>(FormActions.INVALID_FORM),
    tap(action => this.showToast(action)),
  );

  errorPlay: HTMLAudioElement;

  constructor(private actions$: Actions, private toastr: ToastrService) {
    // this.errorPlay = new Audio();
    // this.errorPlay.src = './theme/blueriq/sounds/error-sound.mp3';
    // this.errorPlay.volume = 1.0;
    // this.errorPlay.muted = false;
    // this.errorPlay.load();
  }

  private showToast(action: InvalidFormAction): void {
    if (action.hasErrors) {
      // this.errorPlay.play();
      this.toastr.error(action.message, 'ERROR', {
        timeOut: 5000,
        positionClass: 'toast-bottom-full-width',
      });
    } else if (action.hasWarnings) {
      // this.errorPlay.play();
      this.toastr.warning(action.message, 'WARNING', {
        timeOut: 5000,
        positionClass: 'toast-bottom-full-width',
      });
    }
  }
}
