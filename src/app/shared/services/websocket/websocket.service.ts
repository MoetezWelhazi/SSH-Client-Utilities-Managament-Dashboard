import { Injectable } from '@angular/core';
import { RxStompConfig, RxStomp  } from '@stomp/rx-stomp';
import { Observable } from 'rxjs';
import {WebSocketOptions} from "../../models/websocket.options";
import {SocketResponse} from "../../models/websocket.response";

/**
 * A WebSocket service allowing subscription to a broker.
 */

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends RxStomp {
  private obsStompConnection: Observable<any> | undefined;
  private subscribers: Array<any> = [];
  private subscriberIndex = 0;
  private stompConfig: RxStompConfig = {
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 10000,
    debug: (str) => { console.log(str); }
  };

  constructor(
    private stompService: RxStomp,
    private updatedStompConfig: RxStompConfig,
    private options: WebSocketOptions
  ) {
    super()
    // Update StompJs configuration.
    this.stompConfig = {...this.stompConfig, ...this.updatedStompConfig};
    // Initialise a list of possible subscribers.
    this.createObservableSocket();
    // Activate subscription to broker.
    this.connect();
  }

  private createObservableSocket = () => {
    this.obsStompConnection = new Observable(observer => {
      const subscriberIndex = this.subscriberIndex++;
      this.addToSubscribers({ index: subscriberIndex, observer });
      return () => {
        this.removeFromSubscribers(subscriberIndex);
      };
    });
  }

  private addToSubscribers = (subscriber:any) => {
    this.subscribers.push(subscriber);
  }

  private removeFromSubscribers = (index:any) => {
    for (let i = 0; i < this.subscribers.length; i++) {
      if (i === index) {
        this.subscribers.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Connect and activate the client to the broker.
   */
  private connect = () => {
    // @ts-ignore
    this.stompService.stompClient.configure(this.stompConfig);
    this.stompService.stompClient.onConnect = this.onSocketConnect;
    this.stompService.stompClient.onStompError = this.onSocketError;
    this.stompService.stompClient.activate();
  }


  /**
   * On each connect / reconnect, we subscribe all broker clients.
   */
  private onSocketConnect = (frame:any) => {
    this.stompService.stompClient.subscribe(this.options.brokerEndpoint, this.socketListener);
  }


  private onSocketError = (errorMsg:any) => {
    console.log('Broker reported error: ' + errorMsg);

    const response: SocketResponse = {
      type: 'ERROR',
      message: errorMsg
    };

    this.subscribers.forEach(subscriber => {
      subscriber.observer.error(response);
    });
  }

  private socketListener = (frame:any) => {
    this.subscribers.forEach(subscriber => {
      subscriber.observer.next(this.getMessage(frame));
    });
  }

  private getMessage = (data:any) => {
    const response: SocketResponse = {
      type: 'SUCCESS',
      message: JSON.parse(data.body)
    };
    return response;
  }

  /**
   * Return an observable containing a subscribers list to the broker.
   */
  public getObservable = () => {
    return this.obsStompConnection;
  }
}
