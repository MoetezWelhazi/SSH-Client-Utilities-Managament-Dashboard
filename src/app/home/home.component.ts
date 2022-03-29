import {Component, OnInit, ViewChild} from '@angular/core';
import { UserInfo } from "../shared/interfaces/auth.interface";
import {TokenStorageService} from "../shared/services/auth/token-storage.service";
import {Table} from "primeng/table";
import {PrimeNGConfig} from "primeng/api";
import {Execution} from "../shared/interfaces/execHistory.interface";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private tokenStorage : TokenStorageService, private primengConfig: PrimeNGConfig) {
  }

  hide = true;

  userInfo = this.tokenStorage.getUser();

  selectedExecution? : Execution;

  loading: boolean = false;

  @ViewChild('dt') table: Table | undefined;

  statuses = [
    {label: 'Failure', value: 'Failure'},
    {label: 'Success', value: 'Success'},
  ]

  Executions: Execution[] = [{
    script:'ping.sh',
    date: new Date('2022-03-28 17:22:36'),
    server:'127.0. 0.1',
    result:'Success'
  },
    {
    script:'trigger.sql',
    date: new Date('2022-03-28 14:49:36'),
    server:'127.0. 0.1',
    result:'Failure'
  },{
    script:'random.sh',
    date:new Date('2022-03-28 10:05:36'),
    server:'127.0. 0.1',
    result:'Success'
  }]

  notifications = [
    {
      id: 1,
      title: 'Welcome!',
      description: 'Congratulations for being approved!',
      status: "important",
    },
    {
      id: 2,
      title: 'Permission Granted!',
      description: 'You now have access to all scripts!',
      status: "new",
    },
    {
      id: 3,
      title: 'Execution Failed!',
      description: 'Your scheduled execution has failed!',
      status: "old",
    }
  ];

  data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday', 'Saturday'],
    datasets: [
      {
        label: 'Error Rate of Executions %',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: '#0ce1b4' ,
        lineTension: 0.5,
      }
    ]
  };
  data1 = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday', 'Saturday'],
    datasets: [
      {
        label: 'Executions per day',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: '#0ce1b4' ,
        lineTension: .4,
      }
    ]
  }
  data2 = {
    labels: ['Online','Down','Offline'],
    datasets: [
      {
        data: [30, 5, 7],
        backgroundColor: [
          "#24efce",
          "#ff1717",
          "#232323"
        ],
        hoverBackgroundColor: [
          "#2afddb",
          "#fd4141",
          "#313131"
        ]
      }
    ]
  }
  data3 = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday', 'Saturday'],
    datasets: [
      {
        label: 'Error Rate of Executions %',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: '#0ce1b4' ,
        lineTension: 0.5,
      }
    ]
  }

  pieOption = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    }
  }

  basicOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    document.body.classList.add('home-background');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-background');
  }

  deleteNotification(id: number) {
    console.log("Notification N°"+id+" has been deleted");
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

  onRowSelect($event: any) {
    console.log(this.selectedExecution)
  }
}
