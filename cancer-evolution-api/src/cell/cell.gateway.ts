import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cell } from './interfaces/cell.interface';
import { AnalitcsSimulation } from './interfaces/analiticsSimulation.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
})
export class CellGateway {
  @WebSocketServer() server: Server;

  handleCell(
    cell: Cell,
    behavior: string,
    analitcsSimulation?: AnalitcsSimulation,
  ): void {
    this.server.emit('cell', {
      cell,
      behavior,
      analitcsSimulation,
    });
  }
}
