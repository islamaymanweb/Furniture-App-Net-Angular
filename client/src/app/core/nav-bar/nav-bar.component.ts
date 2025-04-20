import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { Router } from '@angular/router';
import { IBasket } from '../../shared/Models/Basket';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent  {
  username: string = "";
  isMenuOpen = false;
  isUserDropdownOpen = false;
 
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      
      if (this.isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
      if (window.innerWidth >= 992 && this.isMenuOpen) {
        this.toggleMenu();
      }
    }
 


  basket$: Observable<IBasket | null>;

  constructor(public basketService: BasketService) {
    this.basket$ = this.basketService.basket$;
  }


 toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  } 
   
    
  
}
   
