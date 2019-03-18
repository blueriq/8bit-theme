import { Component, Host, Optional } from '@angular/core';
import { BlueriqComponent, OnUpdate } from '@blueriq/angular';
import { List } from '@blueriq/angular/lists';
import { Button } from '@blueriq/core';
import { BqIconDirective } from '@shared/directive/icon/icon.directive';
import { BqPresentationStyles } from '../BqPresentationStyles';

@Component({
  selector: 'bq-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
@BlueriqComponent({
  type: Button,
})
export class ButtonComponent implements OnUpdate {

  isType = 'is-default';

  constructor(@Host() public button: Button,
              @Optional() @Host() public readonly list: List) {
    this.setType();
  }

  bqOnUpdate(): void {
    this.setType();
  }

  private setType() {
    if (this.button.styles.has(BqPresentationStyles.PRIMARY)) {
      this.isType = 'is-primary';
    } else if (this.button.styles.hasAny(BqPresentationStyles.TERTIARY, BqPresentationStyles.WARNING)) {
      this.isType = 'is-warning';
    } else if (this.button.styles.hasAny(BqPresentationStyles.ACCENT, BqPresentationStyles.SUCCESS)) {
      this.isType = 'is-success';
    } else if (this.button.styles.hasAny(BqPresentationStyles.DANGER)) {
      this.isType = 'is-error';
    }
    if (this.button.disabled) {
      this.isType = 'is-disabled';
    }
  }

  hasCaption(): boolean {
    return !!this.button.caption;
  }

  hasIconStyle(): boolean {
    return BqIconDirective.hasIcon(this.button.styles);
  }

  isDisabled(): boolean {
    return this.button.disabled || this.button.styles.has(BqPresentationStyles.DISABLED);
  }

}
