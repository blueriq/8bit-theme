import { animateChild, query, transition, trigger } from '@angular/animations';
import { Component, Host, OnInit, Optional, SkipSelf } from '@angular/core';
import { BlueriqComponent, BlueriqSession, OnUpdate } from '@blueriq/angular';
import { List } from '@blueriq/angular/lists';
import { Container, Page } from '@blueriq/core';
import { BqContentStyles } from '../BqContentStyles';
import { BqPresentationStyles } from '../BqPresentationStyles';

@Component({
  selector: 'bq-container',
  templateUrl: './container.component.html',
  animations: [
    trigger('animate', [
      transition(':leave', [
        query('@*', animateChild(), { optional: true }),
      ]),
    ]),
  ],
})
@BlueriqComponent({
  type: Container,
})
export class ContainerComponent implements OnInit, OnUpdate {

  public isHorizontal = false;

  constructor(@Host() public container: Container,
              private blueriqSession: BlueriqSession,
              @Optional() @SkipSelf() public readonly list: List) {
  }

  ngOnInit() {
    this.determineDisplayStyle();
  }

  bqOnUpdate() {
    this.determineDisplayStyle();
  }

  /**
   * Finds presentation styles to determine if it is a horizontal view
   */
  private determineDisplayStyle() {
    this.isHorizontal = this.container.styles.has(BqPresentationStyles.HORIZONTAL);
  }

  isCard(): boolean {
    const isDashboardBody = this.container.contentStyle === BqContentStyles.DASHBOARD_BODY;
    const dashboardWidget = this.container.contentStyle === BqContentStyles.DASHBOARD_WIDGET ||
      this.container.contentStyle === BqContentStyles.DASHBOARD_FLOWWIDGET;
    const topContainer = this.container.parent instanceof Page && this.blueriqSession.isRoot;
    return ((topContainer && !isDashboardBody) || dashboardWidget || this.container.displayName != null);
  }

}
