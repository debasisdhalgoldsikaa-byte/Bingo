import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-navbar',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './side-navbar.html',
  styleUrl: './side-navbar.scss',
})
export class SideNavbar {
   isMenuOpen = false;
   isImageOpen = false;
   selectedImage = '';

   images: string[] = [
  'r1.png',
  'r2.png',
  'r3.png',
];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

openImage(): void {

  const randomIndex = Math.floor(
    Math.random() * this.images.length
  );

  this.selectedImage = this.images[randomIndex];

  this.isImageOpen = true;

  document.body.style.overflow = 'hidden';
}

closeImage(): void {
  this.isImageOpen = false;

  document.body.style.overflow = '';
}
}
