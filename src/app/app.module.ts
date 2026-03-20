import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { LegacyWidgetComponent } from './legacy-widget/legacy-widget.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [AppComponent, LegacyWidgetComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
  ],
  providers: [],
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const el = createCustomElement(LegacyWidgetComponent, {
      injector: this.injector,
    });

    if (!customElements.get('legacy-angular13-widget')) {
      customElements.define('legacy-angular13-widget', el);
    }
  }
}
