import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupsRoutingModule } from './groups-routing.module';

@NgModule({
  declarations: [GroupListComponent, GroupDetailComponent],
  imports: [SharedModule, ExpensesModule, GroupsRoutingModule]
})
export class GroupsModule {}
