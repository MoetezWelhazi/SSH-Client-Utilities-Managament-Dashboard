export interface Execution {
  script?: string;
  scriptId?:number;
  date?: Date;
  user?: string;
  port?: number;
  executorId?:number;
  serverId?:number;
  serverIp?: string;
  password?: string;
  result?: string ;
  description?: string;
  args?: string;
}
