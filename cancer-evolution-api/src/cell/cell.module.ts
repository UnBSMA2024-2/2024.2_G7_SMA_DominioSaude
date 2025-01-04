import { Module } from '@nestjs/common';
import { CellController } from './cell.controller';
import { CellGateway } from './cell.gateway';

@Module({
  controllers: [CellController],
  providers: [CellGateway]
})
export class CellModule {}
