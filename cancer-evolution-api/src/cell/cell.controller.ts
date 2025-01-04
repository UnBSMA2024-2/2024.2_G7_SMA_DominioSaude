import { Body, Controller, Post } from '@nestjs/common';
import { Cell } from './interfaces/cell.interface';
import { CellGateway } from './cell.gateway';

@Controller('cell')
export class CellController {
  cells: Cell[] = [];
  apoptoseCells: Cell[] = [];

  constructor(private cellGateway: CellGateway) {}

  @Post('/save')
  saveCell(@Body() cell: Cell) {}

  @Post('/apoptose')
  apoptoseCell(@Body() cell: Cell) {}

  @Post('/repair')
  repairCell(@Body() cell: Cell) {}
}
