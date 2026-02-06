import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { combineLatest } from 'rxjs';
import { Expense } from '../../../models/expense.model';
import { Group } from '../../../models/group.model';
import { User } from '../../../models/user.model';
import { AnalyticsService } from '../../../services/analytics.service';
import { AuthService } from '../../../services/auth.service';
import { ExpensesService } from '../../../services/expenses.service';
import { GroupsService } from '../../../services/groups.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  user: User | null = null;
  expenses: Expense[] = [];
  groups: Group[] = [];

  totalPaid = 0;
  totalOwes = 0;
  netBalance = 0;

  donutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#64748b', '#14b8a6']
      }
    ]
  };

  donutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(
    private auth: AuthService,
    private expensesService: ExpensesService,
    private groupsService: GroupsService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.auth.currentUser$,
      this.expensesService.getExpenses(),
      this.groupsService.getGroups()
    ]).subscribe(([user, expenses, groups]) => {
      this.user = user;
      this.expenses = expenses;
      this.groups = groups;

      if (user) {
        this.computeStats(user, expenses);
      }
    });
  }

  private computeStats(user: User, expenses: Expense[]): void {
    this.totalPaid = expenses
      .filter((e) => e.paidBy === user.id)
      .reduce((sum, e) => sum + e.amount, 0);

    this.totalOwes = expenses.reduce((sum, e) => {
      const share = e.splitBetween.find((s) => s.userId === user.id);
      return sum + (share?.amount ?? 0);
    }, 0);

    this.netBalance = +(this.totalPaid - this.totalOwes).toFixed(2);

    const categorySpend = this.analytics.categorySpendForUser(expenses, user.id);
    this.donutData = {
      labels: Object.keys(categorySpend),
      datasets: [
        {
          data: Object.values(categorySpend),
          backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#64748b', '#14b8a6']
        }
      ]
    };
  }

  groupTotal(groupId: number): number {
    return this.expenses
      .filter((e) => e.groupId === groupId)
      .reduce((sum, e) => sum + e.amount, 0);
  }
}
