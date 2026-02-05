import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() hint = '';
  @Input() tone: 'primary' | 'success' | 'muted' = 'primary';
}
