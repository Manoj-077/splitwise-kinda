export interface Balance {
  userId: number;
  amount: number;
}

export interface Transfer {
  from: number;
  to: number;
  amount: number;
}
