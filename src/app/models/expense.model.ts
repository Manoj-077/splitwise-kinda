export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Rent'
  | 'Shopping'
  | 'Utilities'
  | 'Entertainment'
  | 'Other';

export interface ExpenseSplit {
  userId: number;
  amount: number;
}

export interface Expense {
  id: number;
  amount: number;
  description: string;
  category: ExpenseCategory;
  paidBy: number;
  splitBetween: ExpenseSplit[];
  groupId: number;
  date: string;
  settled?: boolean;
}
