import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  template: `<a class="skip-link" href="#contenido">Saltar al contenido</a><app-site-header /><main id="contenido"><router-outlet /></main><app-site-footer />`
})
export class AppComponent {}
