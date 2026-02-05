import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsHomeComponent } from './analytics-home/analytics-home.component';

@NgModule({
  declarations: [AnalyticsHomeComponent],
  imports: [SharedModule, AnalyticsRoutingModule]
})
export class AnalyticsModule {}
