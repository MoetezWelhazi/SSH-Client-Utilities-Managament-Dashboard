import { Component, OnInit } from '@angular/core';
import {GroupInterface} from "../shared/models/group.interface";
import {GroupsService} from "../shared/services/groups/groups.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {NotificationService} from "../shared/services/notifications/notification.service";
import {DialogService} from "primeng/dynamicdialog";
import {AddgroupformComponent} from "../users/addgroupform/addgroupform.component";
import {MatDialogConfig} from "@angular/material/dialog";
import {AddtogroupformComponent} from "../users/addtogroupform/addtogroupform.component";
import {finalize} from "rxjs";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  selectedGroups? : GroupInterface[];
  loading:boolean = true;
  groups: GroupInterface[] = [{id: 0, name: "", members: []}];
  groupOptions = [
    {label: 'Add group', icon: 'pi pi-fw pi-users', command: () => { this.addG(); } },
    {label: 'Delete Selected', icon: 'pi pi-fw pi-trash', command: () => { this.deleteAllG(); } },
  ]
  constructor(  public groupsService: GroupsService,
                public messageService: MessageService ,
                public confirmationService: ConfirmationService,
                private notificationService:NotificationService,
                public dialogService: DialogService

  ) { }

  ngOnInit(): void {
    this.selectedGroups = [{name:""}]
    this.getGroups()
  }

  private getGroups() {
    this.groupsService.getAllGroups(false)
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.groups = data;
          this.groups.map(group=>{
            let members: any[] = []
            group.members?.map(member=>{
              members.push({id:member,gid:group.id})
            })
            group.members = members
            console.log("Group n°"+group.id+" members: "+JSON.stringify(group.members))
          })
          console.log(this.groups);
        },
        error: (e) => this.notificationService.warn("Error: "+e.error)
      });
  }

  private deleteG(group: any, confirm:boolean) {
    if (!confirm) {
      this.emptyGroup(group,false)
      this.groupsService.deleteGroup(group.id)
        .subscribe({
          next: (data) => {
            this.messageService.add({severity: 'success', summary: 'Group Deleted', detail: data.message})
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message})
          }
        })

    }
    else
      this.confirmationService.confirm({
        key:'confirmDialog',
        header: 'Delete Confirmation',
        message: 'Group n°'+group.id+' will be deleted. Are you sure that you want to perform this action?',
        accept: () => {
          this.emptyGroup(group,false)
          this.groupsService.deleteGroup(group.id)
            .subscribe({
              next: (data)=>{
                this.messageService.add({severity:'success', summary:'Group Deleted', detail:data.message})
              },
              error: (err)=> {
                this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
              }
            });
          this.getGroups()
        },
      });
  }

  private updateG(group: GroupInterface, field: string){
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

  getItemsG(Group: any) {
    return [
      {label: 'Rename', icon: 'pi pi-user-edit', command: () => {
          this.updateG(Group,"admin");
        }
      },
      {label: 'Empty Group', icon: 'pi pi-user-minus', command: () => {
          this.emptyGroup(Group,true);
        }
      },
      {label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => {
          this.deleteG(Group, true);
        }
      },
    ];
  }

  getItemsM(member: any) {
    return [
      {label: 'Remove From Group', icon: 'pi pi-user-edit', command: () => {
          this.removeFromGroup(member,true);
        }
      },
    ];
  }

  private addG() {
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

  private deleteAllG() {
    this.confirmationService.confirm({
      key:'confirmDialog',
      header: 'Delete Confirmation',
      message: this.selectedGroups?.length+' groups will be deleted. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedGroups?.forEach((group)=>{
          if (group.id != null) {
            this.deleteG(group.id,false);
          }
        });
        this.getGroups()
      },
    });
  }

  private removeFromGroup(member:any,notify:boolean){
    this.groupsService.removeFromGroup(member.gid,member.id).subscribe(
      {
        next:(data)=>{
          if(notify)
            this.messageService.add({severity:'success', summary:'Group Updated', detail: "User n°"+member.id+" removed successfully from Group n°"+member.gid})
        },
        error:(err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:"Something went wrong with removing User n°"+member.id+" from Group n°"+member.gid+":\n"+err.error.message})
        }
      }
    )
  }

  private emptyGroup(group:any,notify:boolean){
    if(notify)
      this.confirmationService.confirm({
        key:'confirmDialog',
        header: 'Delete Confirmation',
        message: 'Group n°'+group.id+' will be emptied. Are you sure that you want to perform this action?',
        accept: () => {
          group.members.forEach((member:any)=>{
            this.removeFromGroup(member,true)
            this.getGroups()
          })
        },
      });
    else group.members.forEach((member:any)=>{
      this.removeFromGroup(member,false)
      this.getGroups()
    })
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}


