import { Module } from '@nestjs/common';
import { PersonalBoardResolver } from './personal-board.resolver';
import { PersonalBoardService } from './personal-board.service';

@Module({
  providers: [PersonalBoardResolver, PersonalBoardService],
  exports: [PersonalBoardService],
})
export class PersonalBoardModule {}
