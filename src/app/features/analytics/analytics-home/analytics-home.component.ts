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
  selector: 'app-analytics-home',
  templateUrl: './analytics-home.component.html',
  styleUrls: ['./analytics-home.component.css']
})
export class AnalyticsHomeComponent implements OnInit {
  expenses: Expense[] = [];
  groups: Group[] = [];
  user?: User | null;
  selectedGroupId?: number;

  userChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  groupChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }
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
      this.selectedGroupId = this.selectedGroupId ?? groups[0]?.id;
      this.buildUserChart();
      this.buildGroupChart();
    });
  }

  onGroupChange(id: string): void {
    this.selectedGroupId = Number(id);
    this.buildGroupChart();
  }

  private buildUserChart(): void {
    if (!this.user) {
      return;
    }
    const categoryTotals = this.analytics.categorySpendForUser(this.expenses, this.user.id);
    this.userChartData = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#64748b', '#14b8a6']
        }
      ]
    };
  }

  private buildGroupChart(): void {
    if (!this.selectedGroupId) {
      this.groupChartData = { labels: [], datasets: [] };
      return;
    }
    const groupExpenses = this.expenses.filter((e) => e.groupId === this.selectedGroupId);
    const totals = this.analytics.categorySpendForGroup(groupExpenses);
    this.groupChartData = {
      labels: Object.keys(totals),
      datasets: [
        {
          data: Object.values(totals),
          backgroundColor: '#4f46e5'
        }
      ]
    };
  }
}
