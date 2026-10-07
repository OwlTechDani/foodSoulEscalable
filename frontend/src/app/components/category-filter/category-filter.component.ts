import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-category-filter', standalone: true, imports: [NgFor],
  template: `<div class="category-filter" role="group" aria-label="Filtrar por categoría"><button *ngFor="let category of categories" type="button" [class.selected]="selected === category" [attr.aria-pressed]="selected === category" (click)="categoryChange.emit(category)">{{ category }}</button></div>`
})
export class CategoryFilterComponent {
  @Input() categories: string[] = [];
  @Input() selected = 'Todas';
  @Output() categoryChange = new EventEmitter<string>();
}
