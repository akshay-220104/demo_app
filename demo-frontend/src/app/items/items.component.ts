import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Item, ItemsService } from '../services/items.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-items',
  standalone: true,
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  imports: [CommonModule]
})
export class ItemsComponent {
  items$: Observable<Item[]>;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private itemsService: ItemsService) {
    this.items$ = this.itemsService.items$;
  }

  loadItems() {
    this.itemsService.triggerFetch();
  }
  getCurrentPageItems(items: Item[]): Item[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return items.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getTotalPages(items: Item[]): number {
    return Math.ceil(items.length / this.itemsPerPage);
  }
  nextPage(items: Item[]) {
    if (this.currentPage < this.getTotalPages(items)) {
      this.currentPage++;
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  toggleFilter(column: keyof Item, direction: 'ASC' | 'DESC') {
    const modifier = direction === 'ASC' ? 1 : -1;

    this.items$ = this.items$.pipe(
      map(items => [...items].sort((a, b) => {
        if (a[column]! < b[column]!) return -1 * modifier;
        if (a[column]! > b[column]!) return 1 * modifier;
        return 0;
      }))
    );
  }

}
