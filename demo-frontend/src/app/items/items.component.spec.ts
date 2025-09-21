import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsComponent } from './items.component';
import { ItemsService } from '../services/items.service';
import { of } from 'rxjs';

describe('ItemsComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;
  
  const mockItems = [
    { id: 1, name: 'Test PDF', description: 'pdf', sizekb: '100', tags: 'doc', visibility: 'public' },
    { id: 2, name: 'Sample Doc', description: 'doc', sizekb: '200', tags: 'sample', visibility: 'private' }
  ];

  const mockItemsService = {
    items$: of(mockItems),
    triggerFetch: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ItemsService, useValue: mockItemsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter items by name', () => {
    component.searchName = 'Test';
    const filteredItems = component.getCurrentPageItems(mockItems);
    expect(filteredItems.length).toBe(1);
    expect(filteredItems[0].name).toBe('Test PDF');
  });

  it('should clear all filters', () => {
    component.searchName = 'test';
    component.searchFileType = 'pdf';
    
    component.clearFilters();
    
    expect(component.searchName).toBe('');
    expect(component.searchFileType).toBe('');
  });
});