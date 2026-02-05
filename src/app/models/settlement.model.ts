export interface Settlement {
  id: number;
  from: number;
  to: number;
  amount: number;
  groupId?: number;
  date: string;
  settled?: boolean;
}
