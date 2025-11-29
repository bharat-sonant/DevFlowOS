import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { LoggingService } from './logging.service';

@Module({
  providers: [CommonService, LoggingService],
  exports: [CommonService, LoggingService], // export so other modules can use it
})
export class CommonModule {}
