import { Injectable } from '@angular/core';
import { RxStompConfig, RxStomp } from "@stomp/rx-stomp";
import { WebSocketOptions } from "../../models/websocket.options";
import { WebSocketService } from "./websocket.service";

export const executionStompConfig: RxStompConfig = {
  webSocketFactory: () => {
    return new WebSocket('ws://localhost:8081/stomp');
  }
};

@Injectable({
  providedIn: 'root'
})
export class ExecutionWebsocketService extends WebSocketService {

  constructor(stompService: RxStomp) {
    super(stompService, executionStompConfig, new WebSocketOptions('/topic/execution'));
  }
}
