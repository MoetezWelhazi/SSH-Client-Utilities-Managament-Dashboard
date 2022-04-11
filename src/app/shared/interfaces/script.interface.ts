export interface Script {
  id?:number;
  flags?: [{}];
  command?: string;
  name: string;
  description: string;
  author?: string;
  createdAt?: Date;
  editable?: boolean;
  code?:string;

}
