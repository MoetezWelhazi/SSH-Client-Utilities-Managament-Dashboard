export interface UserInfo {
    id?:number;
    email: string;
    password?: string;
    trigramme?: string;
    roles?: {};
    accessToken?: string;
    approved?:any;
    createdAt?: Date;
}
