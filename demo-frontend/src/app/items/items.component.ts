import { Component } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor(private itemsService: ItemsService) {
    this.items$ = this.itemsService.items$;
  }

  loadItems() {
    this.itemsService.triggerFetch();
  }
}
