import {UserInfo} from "./auth.interface";

export interface Script {
  id?:number;
  flags?: [{}];
  command?: string;
  name: string;
  description: string;
  owner?: string;
  createdAt?: Date;
  editable?: any;
  code?:string;
  status?:any;
  shared?:UserInfo[];

}
