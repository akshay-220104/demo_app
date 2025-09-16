import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay, tap } from 'rxjs/operators';

export interface Item {
  id: number;
  name: string;
  description?: string;
  createdat?: string;
}

export interface PaginatedResponse {
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SortConfig {
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  // private fetchTrigger$ = new Subject<{ page: number; pageSize: number }>();
  private fetchTrigger$ = new BehaviorSubject<
  { 
    page: number; 
    pageSize: number;
    sort?: SortConfig;
   }>({ page: 1, pageSize: 4 });
  public items$: Observable<PaginatedResponse>;

  constructor(private http: HttpClient) {
    this.items$ = this.fetchTrigger$.pipe(
      switchMap(({page, pageSize, sort}) => {
        let url = `http://localhost:3000/api/items?page=${page}&pageSize=${pageSize}`;
        if (sort) {
          url += `&sortBy=${sort.sortBy}&sortOrder=${sort.sortOrder}`;
        }
        return this.http.get<PaginatedResponse>(url);
      }),
      shareReplay(1)
    );
  }

  triggerFetch(page: number, pageSize: number, sort?: SortConfig) {
    this.fetchTrigger$.next({page, pageSize, sort});
  }

  createItem(item: { name: string; description: string }) {
    return this.http.post<Item>("http://localhost:3000/api/items", item);
  }

  updateItem(id: number, item: { name: string; description: string; createdat: string }) {
    return this.http.put<Item>(`http://localhost:3000/api/items/${id}`, item).pipe(
      tap(() => {
        const current = this.fetchTrigger$.value;
        this.fetchTrigger$.next(current);
      })
    );
  }

  deleteItem(id: number){
    return this.http.delete<void>(`http://localhost:3000/api/items/${id}`);
  }

  setSortConfig(sortBy: string, sortOrder: 'ASC' | 'DESC') {
    const current = this.fetchTrigger$.value;
    this.fetchTrigger$.next({ ...current, sort: { sortBy, sortOrder } });
  }
}