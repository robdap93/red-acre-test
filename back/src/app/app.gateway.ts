import { HttpService } from '@nestjs/axios';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WsResponse, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*' })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor(private readonly http: HttpService) {}

  afterInit(server: any) {
    console.log("Initialized")
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log("client connected: " + client.id)
  }

  handleDisconnect(client: Socket) {
    console.log("client disconnected: " + client.id)
  }

  @SubscribeMessage('exchange')
  async getExchange(client: Socket, pairs:string) {
    const url = 'https://api.fastforex.io/crypto/fetch-prices?pairs='+pairs+'&api_key=980e696f76-5aea1517c2-rpo01z';
    const { data } = await firstValueFrom(this.http.get(url));
    return {event: 'exchange', data: data.prices[pairs]}
    //in case the number of request to fastforex finish (1milion / month) uncomment the below line :)
    //return {event: 'exchange', data: Math.random() * 10000}
  }
}
