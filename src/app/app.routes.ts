import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompletedComponent } from './completed/completed.component';
import { PendingComponent } from './pending/pending.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { UserComponent } from './user/user.component';

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
    } ,
    {
        path : "register",
        component : RegisterComponent
    },
    {
        path : "login",
        component : LoginComponent
    },
    {
        path : "user",
        component : UserComponent
    },
];
