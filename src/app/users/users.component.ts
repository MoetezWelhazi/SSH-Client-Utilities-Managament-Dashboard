import {Component, OnInit, ViewChild} from '@angular/core';
import { UserInfo } from "../shared/models/auth.interface";
import { Table } from "primeng/table";
import { NotificationService } from "../shared/services/notifications/notification.service";
import { DialogService } from "primeng/dynamicdialog";
import { AdduserformComponent } from "./adduserform/adduserform.component";
import {ConfirmationService, MessageService} from "primeng/api";
import {UsersService} from "../shared/services/users/users.service";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {GroupsService} from "../shared/services/groups/groups.service";
import {GroupInterface} from "../shared/models/group.interface";
import {AddgroupformComponent} from "./addgroupform/addgroupform.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ShareScriptsComponent} from "../allscripts/share-scripts/share-scripts.component";
import {finalize} from "rxjs";
import {AddtogroupformComponent} from "./addtogroupform/addtogroupform.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  statuses: any[] = [];

  tableOptions = [
    {
      label: 'Add user', icon: 'pi pi-fw pi-user-plus', command: () => {
        this.add();
      }
    },
    {
      label: 'Delete Selected', icon: 'pi pi-fw pi-trash', command: () => {
        this.deleteAll();
      }
    },
    {
      label: 'Approve Selected', icon: 'pi pi-fw pi-check', command: () => {
        this.approveAll();
      }
    },
    {
      label: 'Refuse Selected', icon: 'pi pi-fw pi-times', command: () => {
        this.refuseAll();
      }
    },
    {
      label: 'Add to group', icon: 'pi pi-fw pi-users', command: () => {
        this.addToGroup();
      }
    },
  ];

  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;

  @ViewChild('gt') gTable: Table | undefined;

  users: UserInfo[] = [{email: ""}];

  groups: GroupInterface[] = [{id: 0, name: "", members: []}];

  selectedUsers?: UserInfo[];

  selectedMembers?: UserInfo[];

  constructor(private usersService: UsersService,
              private notificationService: NotificationService,
              public confirmationService: ConfirmationService,
              public groupsService: GroupsService,
              public messageService: MessageService,
              public dialog: MatDialog,
              public dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.selectedUsers = [{email: ""}]
    this.selectedMembers = [{email: ""}]

    this.getUsers()
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

  onDateSelect(value: any) {
    // @ts-ignore
    this.table.filter(this.formatDate(value), 'date', 'equals')
  }

  formatDate(date: any) {
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

  onRowSelect(type: string) {
    switch (type) {
      case "users":
        console.log(this.selectedUsers)
    }
    //console.log(this.selectedUsers)
  }

  search(eventValue: any) {
    this.table?.filterGlobal(this.getValue(eventValue), 'contains')
  }

  getStatus(status: any) {
    if (status == 'null')
      return "Refused";
    if (status == '1')
      return "Approved";
    return "Waiting";
  }

  private delete(id: number, confirm: boolean) {
    if (!confirm)
      this.usersService.deleteUser(id)
        .subscribe({
          next: (data) => {
            this.messageService.add({severity: 'success', summary: 'User Deleted', detail: data.message})
            this.users = this.users.filter((user) => {
              return user.id !== id
            });
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message})
          }
        })
    else
      this.confirmationService.confirm({
        key: 'confirmDialog',
        header: 'Delete Confirmation',
        message: 'User n°' + id + ' will be deleted. Are you sure that you want to perform this action?',
        accept: () => {
          this.usersService.deleteUser(id)
            .subscribe({
              next: (data) => {
                this.messageService.add({severity: 'success', summary: 'User Deleted', detail: data.message})
                this.users = this.users.filter((user) => {
                  return user.id !== id
                });
              },
              error: (err) => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message})
              }
            });
        },
      });
  }

  private update(user: UserInfo, field: string) {
    switch (field) {
      case "null":
        user.approved = field;
        user.roles = [this.getRoles(user.roles)];
        break;
      case "approved":
        user.approved = field
        user.roles = [this.getRoles(user.roles)];
        break;
      case "admin":
        user.approved = "approved"
        user.roles = [field];
        break;
    }
    this.usersService.updateUser(user)
      .subscribe({
        next: (data) => {
          this.messageService.add({severity: 'success', summary: 'User Updated', detail: data.message})
          this.getUsers()
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message})
        }
      })

  }

  getItems(User: any) {
    return [
      {
        label: 'Make Admin', icon: 'pi pi-user-edit', command: () => {
          this.update(User, "admin");
        }
      },
      {
        label: 'Delete', icon: 'pi pi-fw pi-user-minus', command: () => {
          this.delete(User.id, true);
        }
      },
      {
        label: 'Approve', icon: 'pi pi-check', command: () => {
          this.update(User, "approved");
        }
      },
      {
        label: 'Refuse', icon: 'pi pi-times', command: () => {
          this.update(User, "null");
        }
      },
    ];
  }

  private add() {
    const ref = this.dialogService.open(AdduserformComponent, {
      header: 'Add User',
      width: '50%'
    });
    ref.onClose.subscribe((userInfo: UserInfo) => {
      if (userInfo) {
        this.usersService.createUser(userInfo)
          .subscribe({
            next: (data) => {
              this.messageService.add({severity: 'success', summary: 'User Added', detail: data.message})
              this.getUsers()
            },
            error: (err) => {
              this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message})
            }
          })
      }
    });
  }

  private deleteAll() {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      header: 'Delete Confirmation',
      message: this.selectedUsers?.length + ' users will be deleted. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedUsers?.forEach((user) => {
          if (user.id != null) {
            this.delete(user.id, false);
          }
        });
      },
    });
  }

  private approveAll() {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      header: 'Delete Confirmation',
      // @ts-ignore
      message: (this.selectedUsers?.length - 1) + ' users will be granted access to the app. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedUsers?.forEach((user) => {
          if ((user.approved == 0 || user.approved == null) && (user.id != null)) {
            this.update(user, "approved");
          }
        })
      },
    });
  }

  private refuseAll() {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      header: 'Delete Confirmation',
      // @ts-ignore
      message: (this.selectedUsers?.length - 1) + ' users will be refused access to the app. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedUsers?.forEach((user) => {
          if ((user.approved == 1 || user.approved == 0) && (user.id != null)) {
            this.update(user, "null");
          }
        })
      },
    })
  }

  getRoles(role: any) {
    if (role == "ROLE_USER")
      return "user";
    return "admin";
  }

  private getUsers() {
    this.usersService.getAllUsers(false)
      .subscribe({
        next: (data) => {
          data.forEach((user) => {
            let newUser: UserInfo = user;
            // @ts-ignore
            newUser.roles = user.roles[0].name;
            switch (user.approved) {
              case null:
                newUser.approved = "null";
                break;
              case true:
                newUser.approved = "1";
                break;
              case false:
                newUser.approved = "0";
            }
            // @ts-ignore
            newUser.createdAt = new Date(user.createdAt)
            let groups: any[] = []
            if(user.groups?.length == 0)
              groups = ["Not Assigned"]
            else user.groups?.forEach((group:any)=>{
              if(group.name)
                groups.push(group.name)
              else groups.push(group)
            })
            newUser.groups = groups
          });
          this.loading = false;
          //console.log(data);
          this.users = data;
        },
        error: (e) => this.notificationService.warn("An error has occurred: " + e.error)
      });
  }

  private getIds(){
    let ids:any[] = []
    this.selectedUsers?.map(user=>{
      if(user.id)
        ids.push(user.id)
    })
    return ids
  }

  private addToGroup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = "material-popup"
    dialogConfig.autoFocus = true;
    dialogConfig.data = {scripts: this.selectedUsers};
    let dialogRef = this.dialog.open(AddtogroupformComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      result.groups.map((group: GroupInterface) => {
        if (group.id) {
          console.log("IDS ARRAYS: " + this.getIds())
          this.getIds().map(id => {
            this.groupsService.addToGroup(group.id, id).subscribe(
              {
                next: (data) => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Group Updated',
                    detail: "User n°" + id + " added successfully to Group n°" + group.id
                  })
                },
                error: (err) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: "Couldn't add User n°" + id + " to Group n°" + group.id + ":\n" + err.error.message
                  })
                }
              }
            )
            this.getUsers()
          })
        }
      })
    })
  }

  getGroups(groups: any) {
    let str : string = ""
    if(groups) {
      if(groups.length==0)
        return "Not Assigned"
      groups.forEach((group: any) => {
        if (group.name) {
          str += " " + group.name
          console.log(typeof group.name)
        }
        else {
          str += " " + group
          console.log(typeof group)
        }
      })
      //console.log(str)
      return str
    }
    return ""


  }
}
