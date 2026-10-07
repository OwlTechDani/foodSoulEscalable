import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-kitchen-note', standalone: true,
  template: `<aside class="kitchen-note"><span class="note-label">APUNTE DE COCINA / {{ number }}</span><h3>{{ title }}</h3><p>{{ text }}</p><span class="note-signature">del cuaderno de Food For My Soul</span></aside>`
})
export class KitchenNoteComponent {
  @Input() number = '01';
  @Input() title = '';
  @Input() text = '';
}
