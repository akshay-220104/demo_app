import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemsService, Item } from './items.service';

describe('ItemsService', () => {
  let service: ItemsService;
  let httpMock: HttpTestingController;

  const mockItems: Item[] = [
    { id: 1, name: 'Item One', sizekb: '100', tags: 'tag1', visibility: 'public' },
    { id: 2, name: 'Item Two', sizekb: '200', tags: 'tag2', visibility: 'private' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsService]
    });

    service = TestBed.inject(ItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should fetch items when triggerFetch is called', () => {
    service.triggerFetch();

    service.items$.subscribe(items => {
      expect(items.length).toBe(2);
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/items');
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('should create an item', () => {
    const newItem: Item = {
      id: 3,
      name: 'New Item',
      sizekb: '150',
      tags: 'new',
      visibility: 'public'
    };

    service.createItem(newItem).subscribe(item => {
      expect(item).toEqual(newItem);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);
    req.flush(newItem);
  });

  it('should delete an item by ID', () => {
    service.deleteItem(1).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('http://localhost:3000/api/items/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update an item', () => {
    const updatedItem: Partial<Item> = { name: 'Updated Name' };

    service.updateItem(1, updatedItem).subscribe(item => {
      expect(item.name).toBe('Updated Name');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/items/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedItem);
    req.flush({ ...mockItems[0], ...updatedItem });
  });
});