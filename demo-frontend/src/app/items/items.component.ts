import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ItemsService, Item, PaginatedResponse } from '../services/items.service';

@Component({
  selector: 'app-items',
  standalone: true,
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  imports: [CommonModule, ItemFormComponent]
})

export class ItemsComponent {
  items$: Observable<PaginatedResponse>;
  currentPage = 1;
  pageSize = 4;
  showForm = false;
  editItemData: Item | null = null

  constructor(private itemsService: ItemsService) {
    this.items$ = this.itemsService.items$;
    // console.log(this.items$);
  }


  loadItems(): void {
    this.itemsService.triggerFetch(this.currentPage, this.pageSize);
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

  showAddForm(){
    this.showForm = true;
  }

  editItem(item: Item) {
    this.editItemData = item;
    this.showForm = true;
  }

  deleteItem(id: number) {
    this.itemsService.deleteItem(id).subscribe({
      next: () => this.loadItems(),
      error: (error) => console.error('Error deleting item:', error)
    });
  }

  toggleFilter(sortBy: string, order: 'ASC' | 'DESC') {
    this.itemsService.setSortConfig(sortBy, order);
  }
}