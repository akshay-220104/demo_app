import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

export interface Item {
  id: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private fetchTrigger$ = new Subject<void>();
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
}