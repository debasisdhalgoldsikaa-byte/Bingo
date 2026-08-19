import { Component, OnInit } from '@angular/core';
import { Child } from '../child/child';

@Component({
  selector: 'app-component-comunication',
  imports: [Child],
  templateUrl: './component-comunication.html',
  styleUrl: './component-comunication.scss',
})
export class ComponentComunication implements OnInit{

  parentChild:any = 'hello Child what are you doing!';
  message:any ='';

  constructor(){

  }

  ngOnInit(){
    // this.parentChild = 'hello Child what are you doing!'
  }

  reciveMsg(data:any){
    this.message = data;
  }

}
