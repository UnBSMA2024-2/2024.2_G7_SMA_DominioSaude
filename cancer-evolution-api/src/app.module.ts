import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CellModule } from './cell/cell.module';

@Module({
  imports: [CellModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
