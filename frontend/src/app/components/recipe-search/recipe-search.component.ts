import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-recipe-search', standalone: true, imports: [FormsModule],
  template: `<form class="recipe-search" (ngSubmit)="search.emit(query)"><label for="recipe-query">¿Qué tienes ganas de cocinar?</label><div class="search-control"><input id="recipe-query" name="query" type="search" [(ngModel)]="query" (ngModelChange)="search.emit($event)" placeholder="Prueba con pasta, huevo, garbanzo…"><button type="submit">Buscar <span aria-hidden="true">↗</span></button></div></form>`
})
export class RecipeSearchComponent {
  @Input() query = '';
  @Output() search = new EventEmitter<string>();
}
