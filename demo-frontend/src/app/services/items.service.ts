import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

export interface Item {
  id: number;
  name: string;
  description?: string;
}

export interface PaginatedResponse {
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private fetchTrigger$ = new Subject<{ page: number; pageSize: number }>();
  public items$: Observable<PaginatedResponse>;

  constructor(private http: HttpClient) {
    this.items$ = this.fetchTrigger$.pipe(
      switchMap(({page, pageSize}) => this.http.get<PaginatedResponse>(`http://localhost:3000/api/items?page=${page}&&pageSize=${pageSize}`)),
      shareReplay(1)
    );
  }

  triggerFetch(page: number, pageSize: number) {
    this.fetchTrigger$.next({page, pageSize});
  }
}