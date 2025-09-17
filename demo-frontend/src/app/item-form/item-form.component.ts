import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../services/items.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent {
  @Input() itemData?: Item;
  @Output() submitItem = new EventEmitter<Item>();
  @Output() cancel = new EventEmitter<void>();

  item: Partial<Item> = {
    name: '',
    description: '',
    createdat: undefined,
    sizekb: '',
    tags: '',
    visibility: '',
  };

  ngOnInit() {
    if (this.itemData) {
      this.item = { ...this.itemData };
    }
  }

  onSubmit() {
    this.submitItem.emit(this.item as Item); 
  }

  onCancel() {
    this.cancel.emit();
  }
}