import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompletedComponent } from './completed/completed.component';
import { PendingComponent } from './pending/pending.component';

export const routes: Routes = [
    {   path : "" , 
        component : DashboardComponent
    },
    {
        path : "completed",
        component : CompletedComponent
    },
    {
        path : "pending",
        component : PendingComponent
    }
];
