import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { MessagesEffect } from '@shared/effects/messages/messages.effect';
import { ValidationEffect } from '@shared/effects/validation/validation.effect';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([
      MessagesEffect,
      ValidationEffect,
    ]),
    ToastrModule.forRoot(),
  ],
})
export class BqEffectsModule {
}
