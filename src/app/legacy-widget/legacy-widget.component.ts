import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getStoredLanguage, onGlobalLanguageChange } from '@platform/i18n';

@Component({
  selector: 'app-legacy-widget',
  templateUrl: './legacy-widget.component.html',
  styleUrls: ['./legacy-widget.component.scss'],
})
export class LegacyWidgetComponent implements OnInit {
  private removeLanguageListener?: () => void;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    const lang = getStoredLanguage();
    console.log(`MFE Angular 13 cargado con idioma: ${lang}`);
    this.translateService.use(lang);

    this.removeLanguageListener = onGlobalLanguageChange((newLang) => {
      this.translateService.use(newLang);
    });
  }

  ngOnDestroy() {
    this.removeLanguageListener?.();
  }
}
