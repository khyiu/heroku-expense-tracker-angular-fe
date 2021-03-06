export * from './balance.service';
import { BalanceService } from './balance.service';
export * from './balance.serviceInterface';
export * from './expense.service';
import { ExpenseService } from './expense.service';
export * from './expense.serviceInterface';
export * from './expenses.service';
import { ExpensesService } from './expenses.service';
export * from './expenses.serviceInterface';
export * from './tags.service';
import { TagsService } from './tags.service';
export * from './tags.serviceInterface';
export const APIS = [
  BalanceService,
  ExpenseService,
  ExpensesService,
  TagsService,
];
