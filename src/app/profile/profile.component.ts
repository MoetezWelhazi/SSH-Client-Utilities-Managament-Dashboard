import {Component, Inject, OnInit} from '@angular/core';
import {TokenStorageService} from "../shared/services/auth/token-storage.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Script} from "../shared/models/script.interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  hide : boolean = true
  currentUser : any = this.tokenStorageService.getUser()

  constructor(
    public dialogRef: MatDialogRef<ProfileComponent>,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
  }

  update() {

  }
}
