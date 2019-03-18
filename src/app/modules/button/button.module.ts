import { NgModule } from '@angular/core';
import { BlueriqComponents, BlueriqModule } from '@blueriq/angular';
import { SharedModule } from '@shared/shared.module';
import { ButtonComponent } from './button.component';

const BLUERIQ_COMPONENTS = [
  ButtonComponent,
];

@NgModule({
  declarations: [
    BLUERIQ_COMPONENTS,
  ],
  providers: [
    BlueriqComponents.register(BLUERIQ_COMPONENTS),
  ],
  imports: [
    BlueriqModule.forRoot(), // using bqClasses
    SharedModule,
  ],
  exports: [BLUERIQ_COMPONENTS],
})
export class ButtonModule {
}
