import { ValueTransformer, ValueTransformerContext } from '@blueriq/angular/forms';
import { DisplayValue, DomainValue, TechnicalValue } from '@blueriq/core';

export class ArrayValueTransformer implements ValueTransformer<any, any> {

  /**
   * Called for synchronizing data from the Blueriq {@link Field} to Angular's {@link FormControl}.
   */
  toControl(value: TechnicalValue | null, context: ValueTransformerContext) {
    return Array.from(new Set(context.field.listValue)).join(',');
  }

  /**
   * Called for synchronizing data from Angular's {@link FormControl} to Blueriq's {@link Field}.
   */
  toField(value: DomainValue | DisplayValue | null, context: ValueTransformerContext) {
    if (value === null) {
      return null;
    }
    return value.toString().trim().split(',').filter(Boolean);
  }
}
