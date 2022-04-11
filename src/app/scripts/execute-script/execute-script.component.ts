import { Component, OnInit } from '@angular/core';
import { Terminal } from "xterm";
import {Execution} from "../../shared/interfaces/execHistory.interface";


@Component({
  selector: 'app-execute-script',
  templateUrl: './execute-script.component.html',
  styleUrls: ['./execute-script.component.scss']
})
export class ExecuteScriptComponent implements OnInit {

  public term?: Terminal;
  hide=true;
  execution: Execution = {
    user:'',
    port:22,
    server:'',
    password:'',
  }

  orders = [{id:'',name:''}];

  getOrders() {
    return [
      { id: '1', name: 'order 1' },
      { id: '2', name: 'order 2' },
      { id: '3', name: 'order 3' },
      { id: '4', name: 'order 4' }
    ];
  }

  constructor() { }

  ngOnInit(): void {
    this.term = new Terminal();
    // @ts-ignore
    this.term.open(document.getElementById('terminal'));
    this.term.writeln('Welcome to xterm.js');
    // @ts-ignore
    this.orders = this.getOrders();
  }

}
