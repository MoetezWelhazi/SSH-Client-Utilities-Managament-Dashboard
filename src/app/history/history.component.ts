import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Table } from 'primeng/table';
import { ExecuteScriptComponent } from '../myscripts/execute-script/execute-script.component';
import { Execution } from '../shared/models/execution';
import { TokenStorageService } from '../shared/services/auth/token-storage.service';
import { HistoryService } from '../shared/services/history/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(public historyService:HistoryService,
    private tokenStorageService: TokenStorageService,
    public dialog: MatDialog,) { }

  statuses = [
    {label: 'Failure', value: 'Failure'},
    {label: 'Success', value: 'Success'},
  ]

  Executions: Execution[] = []

  selectedExecution? : Execution;

  loading: boolean = false;

  @ViewChild('dt') table: Table | undefined;

  ngOnInit(): void {

    this.historyService.getAll().subscribe(data => {
      this.Executions = data;
      console.log(this.Executions);
    })
  }

  ngAfterViewInit() {
    document.body.classList.add('home-background');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-background');
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onRowSelect($event: any) {
    console.log(this.selectedExecution)
  }

  reExecute (Execution : Execution) {
    const user = this.tokenStorageService.getUser();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { script: Execution.script, id: user.id };
    let dialogRef = this.dialog.open(ExecuteScriptComponent, dialogConfig);
  }

}
