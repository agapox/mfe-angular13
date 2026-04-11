import { Component, OnInit, OnDestroy } from '@angular/core';
import { getSelectedUser, onSelectedUserChange } from '@domain/users-sdk';
import { TranslateService } from '@ngx-translate/core';
import { getStoredLanguage, onGlobalLanguageChange } from '@platform/i18n';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-legacy-widget',
  templateUrl: './legacy-widget.component.html',
  styleUrls: ['./legacy-widget.component.scss'],
})
export class LegacyWidgetComponent implements OnInit, OnDestroy {
  private removeLanguageListener?: () => void;

  selectedUser = new BehaviorSubject<any | null>(null);
  private unsubscribeSelectedUser?: () => void;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    const lang = getStoredLanguage();
    console.log(`MFE Angular 13 cargado con idioma: ${lang}`);
    this.translateService.use(lang);

    const currentUser = getSelectedUser();
    this.selectedUser.next(currentUser);

    this.removeLanguageListener = onGlobalLanguageChange((newLang) => {
      this.translateService.use(newLang);
    });

    // Suscribirse al usuario seleccionado global (user-bus)
    this.unsubscribeSelectedUser = onSelectedUserChange((user) => {
      this.selectedUser.next(user);
      console.log('Selected user in Shell (user-bus):', user);
    });
  }

  // El método loadUsers ya no es necesario, todo se maneja por RxJS

  ngOnDestroy() {
    this.removeLanguageListener?.();
    this.unsubscribeSelectedUser?.();
  }
}
