import { Component, Host } from '@angular/core';
import { BlueriqComponent, bySelector } from '@blueriq/angular';
import { BlueriqFormBuilder, getFieldMessages } from '@blueriq/angular/forms';
import { Field, FieldMessages } from '@blueriq/core';
import { BqPresentationStyles } from '../../BqPresentationStyles';
import { ArrayValueTransformer } from './array-value-transformer';

@Component({
  selector: 'bq-chiplist',
  templateUrl: './chiplist.component.html',
})
@BlueriqComponent({
  type: Field,
  selector: bySelector(
    '[multiValued][hasDomain=false]', { priorityOffset: 100 }),
})
export class ChiplistComponent {

  formControl = this.form.control(this.field, {
    syncOn: 'blur',
    transformer: ArrayValueTransformer,
    disableWhen: BqPresentationStyles.DISABLED,
  });

  constructor(@Host() public field: Field,
              private form: BlueriqFormBuilder) {
  }

  get messages(): FieldMessages {
    return getFieldMessages(this.formControl);
  }

  get placeholder(): string {
    return (this.field.placeholder ? this.field.placeholder : '') + '(comma separated)';
  }

}
