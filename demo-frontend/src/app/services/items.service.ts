import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

// export interface NewItem {
//   name: string;
//   description?: string;
//   createdat?: string;
//   sizekb: string;
//   tags: string;
//   visibility: string;
// }

export interface Item {
  id: number;
  name: string;
  description?: string;
  createdat?: string;
  sizekb: string;
  tags: string;
  visibility: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private fetchTrigger$ = new BehaviorSubject<void>(undefined);
  public items$: Observable<Item[]>;

  constructor(private http: HttpClient) {
    this.items$ = this.fetchTrigger$.pipe(
      switchMap(() => this.http.get<Item[]>(`http://localhost:3000/api/items`)),
      shareReplay(1)
    );
  }

  triggerFetch() {
    this.fetchTrigger$.next();
  }
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/items/${id}`);
  }
  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`http://localhost:3000/api/items`, item);
  }
  updateItem(id: number, item: Partial<Item>): Observable<Item> {
    return this.http.put<Item>(`http://localhost:3000/api/items/${id}`, item);
  }
}