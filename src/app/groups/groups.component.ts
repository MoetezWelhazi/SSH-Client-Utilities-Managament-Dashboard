import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupInterface } from "../shared/models/group.interface";
import { Table } from "primeng/table";
import { NotificationService } from "../shared/services/notifications/notification.service";
import { DialogService } from "primeng/dynamicdialog";
import { AddgroupformComponent } from "./addgroupform/addgroupform.component";
import { ConfirmationService, MessageService } from "primeng/api";
import { GroupsService } from "../shared/services/groups/groups.service";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {

  statuses: any[] = [];

  tableOptions = [
    {label: 'Add group', icon: 'pi pi-fw pi-group-plus', command: () => { this.add(); } },
    {label: 'Delete Selected', icon: 'pi pi-fw pi-trash', command: () => { this.deleteAll(); } },
  ];

  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;

  groups: GroupInterface[] =[{id:0,name:""}];

  selectedGroups? : GroupInterface[];

  constructor(private groupsService: GroupsService ,
              private notificationService:NotificationService,
              public confirmationService:ConfirmationService ,
              public messageService: MessageService ,
              public dialogService: DialogService) { }

  ngOnInit(): void {
    this.selectedGroups = [{id:0,name:""}]
    this.getGroups()
    this.statuses = [
      {label: 'Approved', value: '1'},
      {label: 'Waiting', value: '0'},
      {label: 'Refused', value: 'null'}
    ]
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  onDateSelect(value : any) {
    // @ts-ignore
    this.table.filter(this.formatDate(value), 'date', 'equals')
  }

  formatDate(date : any) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    return date.getFullYear() + '-' + month + '-' + day;
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onRowSelect() {
    console.log(this.selectedGroups)
  }

  getStatus(status: any) {
    if(status=='null')
      return "Refused";
    if(status=='1')
      return "Approved";
    return "Waiting";
  }

  private delete(id: number, confirm:boolean) {
    if (!confirm)
      this.groupsService.deleteGroup(id)
        .subscribe({
          next: (data)=>{
            this.messageService.add({severity:'success', summary:'Group Deleted', detail:data.message})
            this.groups = this.groups.filter((group)=> {
              return group.id !== id
            });
          },
          error: (err)=> {
            this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
          }
        })
    else
      this.confirmationService.confirm({
        key:'confirmDialog',
        header: 'Delete Confirmation',
        message: 'Group n°'+id+' will be deleted. Are you sure that you want to perform this action?',
        accept: () => {
          this.groupsService.deleteGroup(id)
            .subscribe({
              next: (data)=>{
                this.messageService.add({severity:'success', summary:'Group Deleted', detail:data.message})
                this.groups = this.groups.filter((group)=> {
                  return group.id !== id
                });
              },
              error: (err)=> {
                this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
              }
            });
        },
      });
  }

  private update(group: GroupInterface, field: string){
    this.groupsService.updateGroup(group)
      .subscribe({
        next: (data)=>{
          this.messageService.add({severity:'success', summary:'Group Updated', detail:data.message})
          this.getGroups()
        },
        error: (err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })

  }

  getItems(Group: any) {
    return [
      {label: 'Rename', icon: 'pi pi-group-edit', command: () => {
          this.update(Group,"admin");
        }
      },
      {label: 'Delete', icon: 'pi pi-fw pi-group-minus', command: () => {
          this.delete(Group.id,true);
        }
      },
      {label: 'View Members', icon: 'pi pi-check', command: () => {
          this.groupMembers();
        }
      },
    ];
  }

  private add() {
    const ref = this.dialogService.open(AddgroupformComponent, {
      header: 'Add Group',
      width: '50%'
    });
    ref.onClose.subscribe((groupInfo : GroupInterface) => {
      if (groupInfo) {
        this.groupsService.createGroup(groupInfo)
          .subscribe({
            next: (data)=>{
              this.messageService.add({severity:'success', summary:'Group Added', detail:data.message})
              this.getGroups()
            },
            error: (err)=>{
              this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
            }
          })
      }
    });
  }

  private deleteAll() {
    this.confirmationService.confirm({
      key:'confirmDialog',
      header: 'Delete Confirmation',
      message: this.selectedGroups?.length+' groups will be deleted. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedGroups?.forEach((group)=>{
          if (group.id != null) {
            this.delete(group.id,false);
          }
        });
      },
    });
  }


  private getGroups() {
    this.groupsService.getAllGroups(false)
      .subscribe({
        next: (data) => {
          this.loading = false;
          //console.log(data);
          this.groups = data;
        },
        error: (e) => this.notificationService.warn("Error: "+e.error)
      });
  }

  private groupMembers() {

  }

  getSize(User: any) {
    
  }
}
