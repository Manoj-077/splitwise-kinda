import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      )
  },
  {
    path: 'groups',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/groups/groups.module').then((m) => m.GroupsModule)
  },
  {
    path: 'expenses',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/expenses/expenses.module').then((m) => m.ExpensesModule)
  },
  {
    path: 'analytics',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/analytics/analytics.module').then(
        (m) => m.AnalyticsModule
      )
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
