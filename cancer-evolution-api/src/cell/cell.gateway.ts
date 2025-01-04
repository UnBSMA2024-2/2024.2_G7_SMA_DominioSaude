import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Cell } from './interfaces/cell.interface';

@WebSocketGateway()
export class CellGateway {
  @WebSocketServer() server: Server;

  handleCell(cell: Cell): void {
    this.server.emit('cell', cell);
  }
}
