import { Injectable } from '@angular/core';
import { Balance, Transfer } from '../models/balance.model';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() {}

  categorySpendForUser(expenses: Expense[], userId: number): Record<string, number> {
    return expenses.reduce<Record<string, number>>((acc, expense) => {
      const paidShare = expense.paidBy === userId ? expense.amount : 0;
      const owes = expense.splitBetween.find((s) => s.userId === userId);
      const net = paidShare - (owes?.amount ?? 0);
      acc[expense.category] = (acc[expense.category] ?? 0) + net;
      return acc;
    }, {});
  }

  categorySpendForGroup(expenses: Expense[]): Record<string, number> {
    return expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
      return acc;
    }, {});
  }

  balancesForGroup(expenses: Expense[], memberIds: number[]): Balance[] {
    const totals = memberIds.reduce<Record<number, number>>(
      (acc, id) => ({ ...acc, [id]: 0 }),
      {}
    );

    expenses.forEach((expense) => {
      totals[expense.paidBy] = (totals[expense.paidBy] ?? 0) + expense.amount;
      expense.splitBetween.forEach((split) => {
        totals[split.userId] = (totals[split.userId] ?? 0) - split.amount;
      });
    });

    return Object.entries(totals).map(([userId, amount]) => ({
      userId: +userId,
      amount
    }));
  }

  settleBalances(balances: Balance[]): Transfer[] {
    const debtors = [...balances.filter((b) => b.amount < 0)].sort(
      (a, b) => a.amount - b.amount
    );
    const creditors = [...balances.filter((b) => b.amount > 0)].sort(
      (a, b) => b.amount - a.amount
    );

    const transfers: Transfer[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settledAmount = Math.min(creditor.amount, Math.abs(debtor.amount));

      if (settledAmount > 0) {
        transfers.push({
          from: debtor.userId,
          to: creditor.userId,
          amount: +settledAmount.toFixed(2)
        });
        debtor.amount += settledAmount;
        creditor.amount -= settledAmount;
      }

      if (Math.abs(debtor.amount) < 0.01) {
        i++;
      }
      if (creditor.amount < 0.01) {
        j++;
      }
    }

    return transfers;
  }
}
