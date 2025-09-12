import { Component } from '@angular/core';
//import { HttpClientModule } from '@angular/common/http';
import { ItemsComponent } from './items/items.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ItemsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'demo-frontend';
}
