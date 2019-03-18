import { Injectable } from '@angular/core';
import {
  Action,
  ButtonPressHandledAction,
  SessionEventActions,
  SessionLoadedAction,
  SessionRegistry,
  StartupActions,
} from '@blueriq/angular';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MessagesEffect {

  @Effect({ dispatch: false })
  sessionActions$: Observable<any> = this.actions$.pipe(
    ofType<Action>(StartupActions.SESSION_LOADED, SessionEventActions.CHANGED_PAGE, SessionEventActions.PAGE_UPDATED),
    tap(action => this.showToast(action)),
  );

  constructor(private actions$: Actions,
              private toastr: ToastrService,
              private sessionRegistry: SessionRegistry) {
  }

  private showToast(action: ButtonPressHandledAction | SessionLoadedAction): void {
    const session = this.sessionRegistry.getByNameOptionally(action.sessionName);
    if (session) {
      const messages = session.pageModel.page.messages;
      if (messages.hasMessages) {
        // concatenate all messages, as only one snackbar can be shown at a time
        const messagesAsText = messages.all.map(message => message.text).join(', ');
        if ((messages.hasErrors)) {
          this.toastr.error(messagesAsText, 'ERROR', {
            positionClass: 'toast-bottom-full-width',
          });
        } else {
          this.toastr.warning(messagesAsText, 'WARNING', {
            positionClass: 'toast-bottom-full-width',
          });
        }
      }
    }
  }
}
