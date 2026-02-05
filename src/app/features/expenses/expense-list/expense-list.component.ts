import { Component, OnInit } from '@angular/core';
import { Expense } from '../../../models/expense.model';
import { Group } from '../../../models/group.model';
import { User } from '../../../models/user.model';
import { ExpensesService } from '../../../services/expenses.service';
import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  groups: Group[] = [];
  users: User[] = [];

  constructor(
    private expensesService: ExpensesService,
    private groupsService: GroupsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.expensesService.getExpenses().subscribe((expenses) => (this.expenses = expenses));
    this.groupsService.getGroups().subscribe((groups) => (this.groups = groups));
    this.usersService.getUsers().subscribe((users) => (this.users = users));
  }

  userName(id: number): string {
    return this.users.find((u) => u.id === id)?.name ?? 'Unknown';
  }

  groupName(id: number): string {
    return this.groups.find((g) => g.id === id)?.name ?? 'Group';
  }

  deleteExpense(expense: Expense): void {
    this.expensesService.deleteExpense(expense.id).subscribe(() => {
      this.expenses = this.expenses.filter((e) => e.id !== expense.id);
    });
  }
}
