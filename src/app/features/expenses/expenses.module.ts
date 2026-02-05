import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpensesRoutingModule } from './expenses-routing.module';

@NgModule({
  declarations: [ExpenseListComponent, ExpenseFormComponent],
  imports: [SharedModule, ExpensesRoutingModule],
  exports: [ExpenseFormComponent]
})
export class ExpensesModule {}
