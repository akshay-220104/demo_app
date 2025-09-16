import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item, ItemsService } from '../services/items.service';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent {
  @Input() showForm = false;
  @Input() editItemData: Item | null = null;
  @Output() formClosed = new EventEmitter<void>();
  item = {
    name: '',
    description: '' ,
    createdat: ''
  };

  constructor(private itemsService: ItemsService) {}

  ngOnChanges() {
    if (this.editItemData) {
      this.item = {
        name: this.editItemData.name,
        description: this.editItemData.description || '',
        createdat: this.editItemData.createdat || ''
      }
      console.log(this.item.createdat);
    }
  }

  onSubmit() {
    if (this.editItemData) {
      this.itemsService.updateItem(this.editItemData.id, this.item).subscribe({
        next: () => {
          this.formClosed.emit();
          this.itemsService.triggerFetch(1, 4); 
          this.resetForm();
        },
        error: (error) => console.error('Error updating item:', error)
      });
    }
    else {
    this.itemsService.createItem(this.item).subscribe({
      next: () => {
        this.formClosed.emit();
        this.itemsService.triggerFetch(1, 4); 
        this.resetForm();
      },
      error: (error) => console.error('Error creating item:', error)
    }); }
  }

  cancelForm() {
    this.formClosed.emit();
    this.resetForm();
  }

  resetForm() {
    this.item = {
      name: '',
      description: '',
      createdat: ''
    };
  }
}