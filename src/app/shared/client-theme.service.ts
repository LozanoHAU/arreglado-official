import { Injectable, signal, computed } from '@angular/core';
import { SiteData } from './event.model';

export interface ClientTheme {
  primary: string;
  secondary: string;
  layout: 'agency' | 'minimal' | 'bold';
}

const DEFAULT_THEME: ClientTheme = {
  primary: '#3d9e52',
  secondary: '#d4a017',
  layout: 'agency',
};

@Injectable({ providedIn: 'root' })
export class ClientThemeService {
  private themeSignal = signal<ClientTheme>(DEFAULT_THEME);

  readonly theme = this.themeSignal.asReadonly();
  readonly cssVars = computed(() => {
    const t = this.themeSignal();
    return {
      '--c1': t.primary,
      '--c2': t.secondary,
    } as Record<string, string>;
  });

  setFromSiteData(data: SiteData | null): void {
    if (!data) {
      this.themeSignal.set(DEFAULT_THEME);
      return;
    }
    this.themeSignal.set({
      primary: data.theme?.primary ?? DEFAULT_THEME.primary,
      secondary: data.theme?.secondary ?? DEFAULT_THEME.secondary,
      layout: data.layout ?? 'agency',
    });
  }
}
