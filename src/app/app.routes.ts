import { Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path: '', component: LogInComponent},
    {path:'home', component: HomeComponent}
];
