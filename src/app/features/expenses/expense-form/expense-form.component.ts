import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Expense, ExpenseCategory, ExpenseSplit } from '../../../models/expense.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnChanges {
  @Input() groupId?: number;
  @Input() participants: User[] = [];
  @Input() expense?: Expense;
  @Output() saved = new EventEmitter<Partial<Expense>>();

  categories: ExpenseCategory[] = [
    'Food',
    'Travel',
    'Rent',
    'Shopping',
    'Utilities',
    'Entertainment',
    'Other'
  ];

  form = this.fb.group({
    description: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    category: ['Food', Validators.required],
    paidBy: [null as number | null, Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expense']?.currentValue) {
      const value = changes['expense'].currentValue as Expense;
      this.form.patchValue({
        description: value.description,
        amount: value.amount,
        category: value.category,
        paidBy: value.paidBy,
        date: value.date
      });
    }
  }

  submit(): void {
    if (this.form.invalid || !this.groupId) {
      this.form.markAllAsTouched();
      return;
    }

    const { description, amount, category, paidBy, date } = this.form.getRawValue();
    const splits = this.buildEqualSplit(amount ?? 0);

    this.saved.emit({
      id: this.expense?.id,
      groupId: this.groupId,
      description: description ?? '',
      amount: amount ?? 0,
      category: (category as ExpenseCategory) ?? 'Other',
      paidBy: paidBy ?? 0,
      date: date ?? new Date().toISOString(),
      splitBetween: splits
    });

    if (!this.expense) {
      this.form.reset({
        description: '',
        amount: 0,
        category: 'Food',
        paidBy,
        date: new Date().toISOString().substring(0, 10)
      });
    }
  }

  private buildEqualSplit(amount: number): ExpenseSplit[] {
    const participantCount = this.participants.length || 1;
    const perHead = +(amount / participantCount).toFixed(2);
    return this.participants.map((user) => ({
      userId: user.id,
      amount: perHead
    }));
  }

  get participantNames(): string {
    const names = this.participants.map((u) => u.name).join(', ');
    return names || 'members';
  }
}
