import { Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { HomeComponent } from './components/game-zone/home/home.component';
import { ComponentComunication } from './components/pages/component-comunication/component-comunication';
import { SideNavbar } from './components/common/side-navbar/side-navbar';
import { TicTacToe } from './components/game-zone/tic-tac-toe/tic-tac-toe';
import { MainLayout } from './components/common/main-layout/main-layout';
import { ConnectsDots } from './components/game-zone/connects-dots/connects-dots';
import { Child } from './components/pages/child/child';
import { Bingo } from './components/game-zone/bingo/bingo';

export const routes: Routes = [
    {path: '', component: LogInComponent},

    {
        path:'',
        component:MainLayout,
        children:[

            {
                path:'home', component: HomeComponent
            },
            {
                path:'c-comunication', component: ComponentComunication
            },
            {
                path:'ticTacToe', component:TicTacToe
            },
            {
                path:'dotconnect', component:ConnectsDots
            },{
                path:'communication', component:ComponentComunication
            }
            ,{
                path:'bingo', component:Bingo
            }
        ]
    },
    {
        path:'**',
        redirectTo:''
    }
];
