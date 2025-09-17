import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Item, ItemsService } from '../services/items.service';
import { CommonModule } from '@angular/common';
import { ItemFormComponent } from '../item-form/item-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-items',
  standalone: true,
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  imports: [CommonModule, ItemFormComponent, FormsModule],
})
export class ItemsComponent {
  items$: Observable<Item[]>;
  currentPage = 1;
  itemsPerPage = 10;
  showForm = false;

  searchName: string = '';
  searchFileType: string = '';
  searchSize: string = '';
  searchTags: string = '';
  searchVisibility: string = '';

  constructor(private itemsService: ItemsService) {
    this.items$ = this.itemsService.items$;
  }

  loadItems() {
    this.itemsService.triggerFetch();
  }

  getCurrentPageItems(items: any[]): any[] {

    let filteredItems = items.filter(item => {
      return item.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
             item.description.toLowerCase().includes(this.searchFileType.toLowerCase()) &&
             item.sizekb.toString().includes(this.searchSize) &&
             item.tags.toLowerCase().includes(this.searchTags.toLowerCase()) &&
             item.visibility.toLowerCase().includes(this.searchVisibility.toLowerCase());
    });

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  clearFilters(): void {
    this.searchName = '';
    this.searchFileType = '';
    this.searchSize = '';
    this.searchTags = '';
    this.searchVisibility = '';
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
      map((items) =>
        [...items].sort((a, b) => {
          if (a[column]! < b[column]!) return -1 * modifier;
          if (a[column]! > b[column]!) return 1 * modifier;
          return 0;
        })
      )
    );
  }

  deleteItem(id: number) {
    const confirmation = confirm('Are you sure you want to delete this item?');
    if (confirmation) {
      this.itemsService.deleteItem(id).subscribe(() => {
        this.loadItems();
      });
    }
  }


selectedItem?: Item;

createItem() {
  this.selectedItem = undefined;
  this.showForm = true;
}

editItem(item: Item) {
  this.selectedItem = item;
  this.showForm = true;
}

handleSubmit(item: Item) {
  if ('id' in item) {
    this.itemsService.updateItem(item.id, item).subscribe(() => {
      this.showForm = false;
      this.loadItems();
    });
  } else {
    this.itemsService.createItem(item).subscribe(() => {
      this.showForm = false;
      this.loadItems();
    });
  }
}

handleCancel() {
  this.showForm = false;
}

}
