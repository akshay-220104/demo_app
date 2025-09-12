import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Item, ItemsService, PaginatedResponse } from '../services/items.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-items',
  standalone: true,
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  imports: [CommonModule]
})
export class ItemsComponent {
  items$: Observable<PaginatedResponse>;
  currentPage = 1;
  pageSize = 4;

  constructor(private itemsService: ItemsService) {
    this.items$ = this.itemsService.items$;
    this.loadItems();
  }

  loadItems(): void {
    this.itemsService.triggerFetch( this.currentPage, this.pageSize);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadItems();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadItems();
    }
  }

  getTotalPages(total: number): number {
    return Math.ceil(total / this.pageSize);
  }
}
