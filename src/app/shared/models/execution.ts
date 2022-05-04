import { UserInfo } from "./auth.interface";
import { Script } from "./script.interface";

export interface Execution {
    id :number;
    createdAt : Date;
    executor: any;
    script: any;
    server: any;
    result: String
}
