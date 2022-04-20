import {Script} from "./script.interface";

export interface Upload{
  script: Script;
  file?: File;
  id: any;
}
