import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { LegacyWidgetComponent } from './legacy-widget/legacy-widget.component';
import { createCustomElement } from '@angular/elements';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TabsComponent } from './components/tabs/tabs.component';

@NgModule({
  declarations: [AppComponent, LegacyWidgetComponent, TabsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
    MatTabsModule,
  ],
  providers: [],
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    console.log('MFE Angular 13 cargado y widget registrado');
    const el = createCustomElement(LegacyWidgetComponent, {
      injector: this.injector,
    });

    if (!customElements.get('legacy-angular13-widget')) {
      customElements.define('legacy-angular13-widget', el);
      console.log('legacy-angular13-widget registrado como custom element');
    }
  }
}

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    'http://localhost:4201/assets/i18n/',
    '.json',
  );
}
