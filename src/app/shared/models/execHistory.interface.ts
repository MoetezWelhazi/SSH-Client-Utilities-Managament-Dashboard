export interface Execution {
  script?: string;
  scriptId?:number;
  date?: Date;
  user?: string;
  port?: number;
  executorId?:number;
  server?: string;
  password?: string;
  result?: string ;
  description?: string;
}
