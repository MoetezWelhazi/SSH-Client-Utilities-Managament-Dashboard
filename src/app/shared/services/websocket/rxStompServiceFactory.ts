import {RxStompService} from "./rxstomp.service";
import {myRxStompConfig} from "./rxstomp.config";


export function rxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}
