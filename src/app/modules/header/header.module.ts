import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BlueriqComponents, BlueriqModule } from '@blueriq/angular';
import { SharedModule } from '@shared/shared.module';
import { HeaderComponent } from './header.component';

const BLUERIQ_COMPONENTS = [
  HeaderComponent,
];

@NgModule({
  declarations: [
    BLUERIQ_COMPONENTS,
  ],
  providers: [
    BlueriqComponents.register(BLUERIQ_COMPONENTS),
  ],
  imports: [
    CommonModule,
    BlueriqModule.forRoot(),  // using bqIncluded
    FlexLayoutModule,
    SharedModule, // using bqKey
  ],
  exports: [BLUERIQ_COMPONENTS],
})
export class HeaderModule {
}
