import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';

@NgModule({
  declarations: [TopNavComponent, BottomNavComponent, StatCardComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgChartsModule,
    TopNavComponent,
    BottomNavComponent,
    StatCardComponent
  ]
})
export class SharedModule {}
