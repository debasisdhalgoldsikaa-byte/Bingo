import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  imports: [],
  templateUrl: './child.html',
  styleUrl: './child.scss',
})
export class Child {
  @Input() parentToChild!:string;
  @Output() msgEvent = new EventEmitter<string>

  sendMsg(){
    this.msgEvent.emit('hey parent i am aliright hrere');
  }
  
}
