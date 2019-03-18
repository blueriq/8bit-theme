import { Component, HostListener, isDevMode, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FailedAction,
  isBlueriqError,
  QueryParameters,
  ShortcutDetails,
  UnauthorizedProjectAction,
} from '@blueriq/angular';
import { ErrorType, SessionId } from '@blueriq/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorModel } from './modules/error/error.model';

@Component({
  templateUrl: './project.component.html',
})
export class ProjectComponent implements OnInit {

  sessionName: Observable<string>;
  sessionId: Observable<SessionId | null>;
  shortcut: Observable<string | null>;
  version: Observable<string | null>;
  project: Observable<string | null>;
  flow: Observable<string | null>;
  languageCode: Observable<string | null>;
  parameters: Observable<QueryParameters | null>;

  error: ErrorModel | null;

  mousePlay: HTMLAudioElement;

  constructor(private readonly route: ActivatedRoute, private router: Router) {
    // this.mousePlay = new Audio();
    // this.mousePlay.src = './theme/blueriq/sounds/mouse-click.mp3';
    // this.mousePlay.volume = 1.0;
    // this.mousePlay.muted = false;
    // this.mousePlay.load();
  }

  ngOnInit(): void {
    this.sessionName = this.route.queryParamMap.pipe(map(params => {
      const tab = params.get('tab');

      return tab ? `Main-${tab}` : 'Main';
    }));
    this.sessionId = this.route.paramMap.pipe(map(params => params.get('sessionId')));
    this.shortcut = this.route.paramMap.pipe(map(params => params.get('shortcut')));
    this.version = this.route.paramMap.pipe(map(params => params.get('version')));
    this.project = this.route.paramMap.pipe(map(params => params.get('project')));
    this.flow = this.route.paramMap.pipe(map(params => params.get('flow')));
    this.languageCode = this.route.paramMap.pipe(map(params => params.get('languageCode')));

    const qp = this.route.queryParams;
    this.parameters = qp;
  }

  /** Call this method to clear the error and thus removing it from view */
  clearError(): void {
    this.error = null;
  }

  /** Handler for Session Expired events */
  onSessionExpired() {
    this.error = new ErrorModel(
      ErrorType.UnknownSession,
      'Session expired',
      'Your session has expired due to inactivity',
    );
  }

  /** Handler for Flow Ended events */
  onFlowEnded() {
    this.error = new ErrorModel(
      ErrorType.FlowEnded,
      'Flow ended',
      'The flow has ended',
    );
  }

  /** Handler for unauthorized events, navigate to login page */
  onUnauthorized(details: UnauthorizedProjectAction) {
    if (details.details instanceof ShortcutDetails) {
      const returnUrl = 'shortcut/' + details.details.shortcut;
      this.router.navigate(['/login'], { queryParams: { returnUrl } });
    } else {
      const { flow, project, version } = details.details.params;
      const returnUrl = `flow/${project}/${flow}/${version || ''}`;
      this.router.navigate(['/login'], { queryParams: { returnUrl } });
    }
  }

  onError(action: FailedAction): void {
    if (isDevMode()) {
      console.error(action);
    }
    if (isBlueriqError(action.error)) {
      const { errorType, message, title } = action.error.cause;

      this.error = new ErrorModel((errorType || ErrorType.Exception) as any, title, message);
    } else {
      this.error = new ErrorModel(ErrorType.Exception, 'Oops!', 'An unknown error occurred');
    }
  }

  // @HostListener('document:click', ['$event'])
  // onMousedown(event) {
  //   this.mousePlay.play();
  // }

}
