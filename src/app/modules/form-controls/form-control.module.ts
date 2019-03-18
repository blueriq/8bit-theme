import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlueriqComponents } from '@blueriq/angular';
import { BlueriqFormsModule } from '@blueriq/angular/forms';
import { SharedModule } from '@shared/shared.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { DomainValueTransformer } from './autocomplete/domain-value-transformer';
import { BqErrorstateMatcherDirective } from './bq-errorstate-matcher.directive';
import { ArrayValueTransformer } from './chiplist/array-value-transformer';
import { ChiplistComponent } from './chiplist/chiplist.component';
import { DateTimepickerComponent } from './date/datetimepicker/datetimepicker.component';
import { MomentTransformer } from './date/moment-transformer';
import { CurrencyFieldComponent } from './input-field/currency/currency.component';
import { IntegerFieldComponent } from './input-field/integer/integer.component';
import { NumberFieldComponent } from './input-field/number/number.component';
import { PercentageFieldComponent } from './input-field/percentage/percentage.component';
import { StringFieldComponent } from './input-field/string/string.component';
import { SelectComponent } from './select/select.component';
import { CheckboxComponent } from './selection-control/checkbox/checkbox.component';
import { RadioButtonComponent } from './selection-control/radio-button/radio-button.component';
import { TextAreaComponent } from './text-area/text-area.component';

const FORM_CONTROL_COMPONENTS = [
  AutocompleteComponent,
  CheckboxComponent,
  ChiplistComponent,
  CurrencyFieldComponent,
  DateTimepickerComponent,
  IntegerFieldComponent,
  NumberFieldComponent,
  PercentageFieldComponent,
  RadioButtonComponent,
  SelectComponent,
  StringFieldComponent,
  TextAreaComponent,
];

@NgModule({
  declarations: [
    FORM_CONTROL_COMPONENTS,
    BqErrorstateMatcherDirective,
  ],
  providers: [
    BlueriqComponents.register(FORM_CONTROL_COMPONENTS),
    DomainValueTransformer,
    ArrayValueTransformer,
    MomentTransformer,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    BlueriqFormsModule.forRoot(),
  ],
  exports: [FORM_CONTROL_COMPONENTS],
})

export class FormControlModule {
}
