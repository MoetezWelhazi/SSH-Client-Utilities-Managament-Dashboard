import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { FunctionsUsingCSI, NgTerminal } from 'ng-terminal';
import { Execution } from "../../shared/models/execHistory.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Script} from "../../shared/models/script.interface";
import {ExecutionWebsocketService} from "../../shared/services/websocket/execution.websocket.service";
import { Message } from '@stomp/stompjs';


@Component({
  selector: 'app-execute-script',
  templateUrl: './execute-script.component.html',
  styleUrls: ['./execute-script.component.scss']
})
export class ExecuteScriptComponent implements OnInit {
  public executionProgress: any ={}
  // @ts-ignore
  @ViewChild('term', { static: true }) child: NgTerminal;
  hide=true;
  execution: Execution = {
    user:'',
    port:22,
    server:'',
    password:'',
  }
  selectedServer = '';

  servers = [
    { id: '1', name: 'server 1' },
    { id: '2', name: 'server 2' },
    { id: '3', name: 'server 3' },
    { id: '4', name: 'server 4' }
  ];


  constructor(@Inject(MAT_DIALOG_DATA) public data: {script: Script, id:number},
              public dialogRef: MatDialogRef<ExecuteScriptComponent>,
              private executionWebsocketService: ExecutionWebsocketService) { }

  ngOnInit(): void {
    this.executionWebsocketService.watch('/script/execution/'+this.data.id).subscribe((message:Message)=>{
      this.child.underlying.clear();
      this.child.write(message.body);
      console.log("MESSAGE RECEIVED");
    })
  }
  ngAfterViewInit(){
    this.child.keyEventInput.subscribe(e => {
      console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);

      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === 13) {
        this.child.write('\n' + FunctionsUsingCSI.cursorColumn(1) + '$ '); // \r\n
      } else if (ev.keyCode === 8) {
        if (this.child.underlying.buffer.active.cursorX > 2) {
          this.child.write('\b \b');
        }
      } else if (printable) {
        this.child.write(e.key);
      }
    })
    this.child.write("Press Execute to run the script...")
    this.child.underlying.clear()

  }

  executeScript() {

  }

  clearTerminal() {
    this.child.underlying.clear()
  }
}
