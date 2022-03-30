import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {DialogModule} from 'primeng/dialog';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {ProgressBarModule} from 'primeng/progressbar';
import {DropdownModule} from 'primeng/dropdown';
import {MenuModule} from "primeng/menu";

import {NgModule} from "@angular/core";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {ChartModule} from "primeng/chart";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@NgModule({
  exports: [
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    MenuModule,
    ChartModule,
    SharedModule,
    ConfirmPopupModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, DialogService, ConfirmationService]
})
export class PrimengModule {}
