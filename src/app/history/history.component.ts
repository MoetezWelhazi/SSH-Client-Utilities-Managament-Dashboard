import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Table } from 'primeng/table';
import { ExecuteScriptComponent } from '../myscripts/execute-script/execute-script.component';
import { TokenStorageService } from '../shared/services/auth/token-storage.service';
import { HistoryService } from '../shared/services/history/history.service';
import { MessageService } from "primeng/api";
import { Execution } from "../shared/models/execHistory.interface";
import {ExecutionDetailsComponent} from "./execution-details/execution-details.component";
import { reexecuteComponent } from './execution-details/re-execute/re-execute.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(private historyService:HistoryService,
    private tokenStorageService: TokenStorageService,
    public messageService:MessageService,
    public dialog: MatDialog,) { }

  statuses = [
    {label: 'Failure', value: 'Failure'},
    {label: 'Success', value: 'Success'},
    {label: 'Critical-Failure', value: 'Critical-Failure'}
  ]

  Executions: Execution[] = []

  selectedExecution? : Execution;

  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;

  ngOnInit(): void {
    this.getExecutions()

  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onRowSelect($event: any) {
    console.log(this.selectedExecution)
  }

  details (Execution : Execution) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "material-popup"
    dialogConfig.data = { execution: Execution};
    let dialogRef = this.dialog.open(ExecutionDetailsComponent, dialogConfig);
  }

  private getExecutions() {
    this.historyService.getAll().subscribe({
      next:data =>
    {
      data.forEach((execution:Execution)=>{
        if(execution.executor.trigramme)
        execution.executor = execution.executor.email
      })
      this.Executions = data;
      this.loading = false
      console.log(this.Executions);
    },
      error: err =>{
        this.messageService.add({severity:"error",summary:"Error",detail:err.message})
      }
  })
  }

}
