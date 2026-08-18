import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavbar } from '../side-navbar/side-navbar';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule,RouterOutlet,SideNavbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
