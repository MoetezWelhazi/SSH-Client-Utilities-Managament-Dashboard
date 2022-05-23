export interface Execution {
  script?: any;
  scriptId?:number;
  createdAt?: Date;
  user?: string;
  username?:string;
  port?: number;
  executorId?:number;
  executor?:any;
  server?:any;
  serverId?:number;
  serverIp?: string;
  password?: string;
  result?: string;
  existStatus?: string;
  args?: string;
  details?:string;
  id?:string;
}
