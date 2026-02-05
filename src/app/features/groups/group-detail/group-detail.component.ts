import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Balance, Transfer } from '../../../models/balance.model';
import { Expense } from '../../../models/expense.model';
import { Group } from '../../../models/group.model';
import { User } from '../../../models/user.model';
import { AnalyticsService } from '../../../services/analytics.service';
import { ExpensesService } from '../../../services/expenses.service';
import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {
  group?: Group;
  members: User[] = [];
  expenses: Expense[] = [];
  balances: Balance[] = [];
  transfers: Transfer[] = [];
  editingExpense?: Expense;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupsService: GroupsService,
    private expensesService: ExpensesService,
    private usersService: UsersService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/groups']);
      return;
    }
    this.loadData(id);
  }

  loadData(groupId: number): void {
    forkJoin({
      group: this.groupsService.getGroup(groupId),
      expenses: this.expensesService.getByGroup(groupId),
      users: this.usersService.getUsers()
    }).subscribe(({ group, expenses, users }) => {
      this.group = group;
      this.expenses = expenses;
      this.members = users.filter((u) => group.members.includes(u.id));
      this.computeBalances();
      this.loading = false;
    });
  }

  addExpense(payload: Partial<Expense>): void {
    if (payload.id) {
      this.expensesService.updateExpense(payload as Expense).subscribe((expense) => {
        this.expenses = this.expenses.map((e) => (e.id === expense.id ? expense : e));
        this.editingExpense = undefined;
        this.computeBalances();
      });
      return;
    }

    this.expensesService.createExpense(payload).subscribe((expense) => {
      this.expenses = [...this.expenses, expense];
      this.computeBalances();
    });
  }

  removeExpense(expense: Expense): void {
    this.expensesService.deleteExpense(expense.id).subscribe(() => {
      this.expenses = this.expenses.filter((e) => e.id !== expense.id);
      this.computeBalances();
    });
  }

  startEdit(expense: Expense): void {
    this.editingExpense = expense;
  }

  computeBalances(): void {
    if (!this.group) {
      return;
    }
    this.balances = this.analytics.balancesForGroup(this.expenses, this.group.members);
    this.transfers = this.analytics.settleBalances(
      this.balances.map((b) => ({ ...b }))
    );
  }

  memberName(id: number): string {
    return this.members.find((m) => m.id === id)?.name ?? 'Member';
  }
}
