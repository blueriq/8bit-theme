import { async, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChangedPageAction, PageUpdatedAction, SessionLoadedAction, SessionRegistry } from '@blueriq/angular';
import { SessionTemplate } from '@blueriq/angular/testing';
import { LanguageConfiguration } from '@blueriq/core';
import { PageModelTemplate, PageTemplate } from '@blueriq/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MessagesEffect } from '@shared/effects/messages/messages.effect';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';

describe('MessagesEffect', () => {
  let actions: Subject<any>;
  let effects: MessagesEffect;
  let sessionRegistry: SessionRegistry;

  const errorMsg = 'This is an error message';
  const warnMsg = 'This is a warning message';
  const pageWithError = PageTemplate.create().error(errorMsg);
  const pageWithWarning = PageTemplate.create().warning(warnMsg);
  const languageConf: LanguageConfiguration = {
    languageCode: 'nl-NL',
    patterns: {},
    messages: {},
  };

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
        SessionRegistry,
        MessagesEffect,
        provideMockActions(() => actions),
      ],
    });
    sessionRegistry = TestBed.get(SessionRegistry);
    effects = TestBed.get(MessagesEffect);
  }));

  it('does animate toasts again even if already displayed the message', () => {
    const session = SessionTemplate.create()
    .sessionName('Main')
    .pageModel(PageModelTemplate.create(PageTemplate.create().error(errorMsg))).build();
    sessionRegistry.register(session);

    const action = new SessionLoadedAction('Main', '1', '2', 3, '', languageConf, [pageWithError.toJson()]);
    effects.sessionActions$.subscribe();
    actions.next(action);

    // Verify
    expect(ToastrService.prototype.error).toHaveBeenCalledWith(errorMsg, 'ERROR', {
      positionClass: 'toast-bottom-full-width',
    });
  });

  it('opens toasts with an error message when session is loaded', () => {
    const session = SessionTemplate.create()
    .sessionName('Main')
    .pageModel(PageModelTemplate.create(PageTemplate.create().error(errorMsg))).build();
    sessionRegistry.register(session);

    const action = new SessionLoadedAction('Main', '1', '2', 3, '', languageConf, [pageWithError.toJson()]);
    effects.sessionActions$.subscribe();
    actions.next(action);

    // Verify
    expect(ToastrService.prototype.error).toHaveBeenCalledWith(errorMsg, 'ERROR', {
      positionClass: 'toast-bottom-full-width',
    });
  });

  it('opens toasts with an error message when page is updated', () => {
    const session = SessionTemplate.create()
    .sessionName('my-session')
    .pageModel(PageModelTemplate.create(pageWithError)).build();
    sessionRegistry.register(session);

    const action = new PageUpdatedAction('my-session', [{}] as any);

    effects.sessionActions$.subscribe();
    actions.next(action);

    // Verify
    expect(ToastrService.prototype.error).toHaveBeenCalledWith(errorMsg, 'ERROR', {
      positionClass: 'toast-bottom-full-width',
    });
  });

  it('opens toasts with an error message when page is changed', () => {
    const session = SessionTemplate.create()
    .sessionName('my-session')
    .pageModel(PageModelTemplate.create(pageWithError)).build();
    sessionRegistry.register(session);

    const action = new ChangedPageAction('my-session', [{}] as any);

    effects.sessionActions$.subscribe();
    actions.next(action);

    // Verify
    expect(ToastrService.prototype.error).toHaveBeenCalledWith(errorMsg, 'ERROR', {
      positionClass: 'toast-bottom-full-width',
    });
  });

  it('opens toasts with multiple error messages', () => {
    const anotherErrorMsg = 'Another error message';
    const session = SessionTemplate.create()
    .sessionName('my-session')
    .pageModel(PageModelTemplate.create(PageTemplate.create().error(errorMsg).error(anotherErrorMsg))).build();
    sessionRegistry.register(session);

    const action = new PageUpdatedAction('my-session', [{}] as any);

    effects.sessionActions$.subscribe();
    actions.next(action);

    // Verify
    expect(ToastrService.prototype.error).toHaveBeenCalledWith(`${errorMsg}, ${anotherErrorMsg}`, 'ERROR', {
      positionClass: 'toast-bottom-full-width',
    });
  });

  it('opens error toasts with mixed error and warning messages', () => {
    const session = SessionTemplate.create()
    .sessionName('my-session')
    .pageModel(PageModelTemplate.create(PageTemplate.create().error(errorMsg).warning(warnMsg))).build();
    sessionRegistry.register(session);

    const action = new PageUpdatedAction('my-session', [{}] as any);

    effects.sessionActions$.subscribe();
    actions.next(action);

    // Verify
    expect(ToastrService.prototype.error).toHaveBeenCalledWith(`${errorMsg}, ${warnMsg}`, 'ERROR', {
      positionClass: 'toast-bottom-full-width',
    });
  });

  it('opens toasts with a warning message', () => {
    const session = SessionTemplate.create()
    .sessionName('my-session')
    .pageModel(PageModelTemplate.create(pageWithWarning)).build();
    sessionRegistry.register(session);

    const action = new ChangedPageAction('my-session', [{}] as any);

    effects.sessionActions$.subscribe();
    actions.next(action);

    // Verify
    expect(ToastrService.prototype.warning).toHaveBeenCalledWith(`${warnMsg}`, 'WARNING', {
      positionClass: 'toast-bottom-full-width',
    });
  });

  it('does not do anything when page has no errors or warnings', () => {
    const action = new SessionLoadedAction('Main', '1', '2', 60, '', languageConf, PageModelTemplate.create(PageTemplate.create()).toJson());

    effects.sessionActions$.subscribe();
    actions.next(action);

    // Verify
    expect(ToastrService.prototype.warning).not.toHaveBeenCalled();
  });
});
