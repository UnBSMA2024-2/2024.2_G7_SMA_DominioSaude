import { Module } from '@nestjs/common';
import { CellModule } from './cell/cell.module';

@Module({
  imports: [CellModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
