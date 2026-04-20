import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  getSelectedUser,
  onSelectedUserChange,
  getSelectedUser2,
  onSelectedUserChange2,
} from '@domain/users-sdk';
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

  selectedUser2 = new BehaviorSubject<any | null>(null);
  private unsubscribeSelectedUser2?: () => void;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    const lang = getStoredLanguage();
    this.translateService.use(lang);

    const currentUser = getSelectedUser();
    this.selectedUser.next(currentUser);

    const currentUser2 = getSelectedUser2();
    this.selectedUser2.next(currentUser2);

    this.removeLanguageListener = onGlobalLanguageChange((newLang) => {
      this.translateService.use(newLang);
    });

    // Suscribirse al usuario seleccionado global (user-bus)
    this.unsubscribeSelectedUser = onSelectedUserChange((user) => {
      this.selectedUser.next(user);
      console.log('Selected user in Shell (user-bus):', user);
    });

    this.unsubscribeSelectedUser2 = onSelectedUserChange2((user: any) => {
      this.selectedUser2.next(user);
      console.log('Selected user UNICREDIT in Shell (user-bus):', user);
    });
  }

  // El método loadUsers ya no es necesario, todo se maneja por RxJS

  ngOnDestroy() {
    this.removeLanguageListener?.();
    this.unsubscribeSelectedUser?.();
    this.unsubscribeSelectedUser2?.();
  }
}
