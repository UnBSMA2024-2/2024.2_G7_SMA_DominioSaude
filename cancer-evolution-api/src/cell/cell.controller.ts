import { Body, Controller, Post } from '@nestjs/common';
import { Cell } from './interfaces/cell.interface';
import { CellGateway } from './cell.gateway';

@Controller('cell')
export class CellController {
  constructor(private cellGateway: CellGateway) {}

  @Post()
  saveCell(@Body() cell: Cell) {
    console.log('division: ', cell);
    this.cellGateway.handleCell(cell, 'division');
  }

  @Post('/apoptose')
  apoptoseCell(@Body() cell: Cell) {
    console.log('apoptose: ', cell);
    this.cellGateway.handleCell(cell, 'apoptose');
  }

  @Post('/repair')
  repairCell(@Body() cell: Cell) {
    console.log('repair: ', cell);
    this.cellGateway.handleCell(cell, 'repair');
  }
}
