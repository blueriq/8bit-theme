import { state, style, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivityType, GlobalLoadingActivity } from '@blueriq/angular';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'bq-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [
    trigger('state', [
      state('loading, starting', style({ display: 'inline' })),
      state('idle', style({ display: 'none' })),
    ]),
  ],
})
export class LoadingComponent implements OnInit {

  state$: Observable<'starting' | 'loading' | 'idle'>;

  progress = 33;

  constructor(private loadingActivity: GlobalLoadingActivity) {
    this.load();
  }

  async load() {
    for (let i = 0; i < 100; i++) {
      this.progress = i;
      await this.timer(10);
    }
  }

  timer(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  ngOnInit(): void {
    const startingSession$ = this.loadingActivity.isActive(ActivityType.StartingSession);
    const interaction$ = this.loadingActivity.isActiveWithDelay(ActivityType.Interaction, 400);
    const fieldRefresh$ = this.loadingActivity.isActiveWithDelay(ActivityType.FieldRefresh, 400);

    this.state$ = combineLatest(startingSession$, interaction$, fieldRefresh$).pipe(
      map(([isStarting, interaction, fieldRefresh]) => {
        return isStarting ? 'starting' : interaction || fieldRefresh ? 'loading' : 'idle';
      }),
    );
  }

  timeout() {
    const that = this;
    setTimeout(function () {
      that.progress++;
      if (that.progress < 100) {
        that.timeout();
      }
    }, 1);
  }
}
