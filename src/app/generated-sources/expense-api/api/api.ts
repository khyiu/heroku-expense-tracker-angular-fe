export * from './expense.service';
import { ExpenseService } from './expense.service';

export * from './expense.serviceInterface';
export * from './expenses.service';
import { ExpensesService } from './expenses.service';

export * from './expenses.serviceInterface';
export const APIS = [ExpenseService, ExpensesService];
