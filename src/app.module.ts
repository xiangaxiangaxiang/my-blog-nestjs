import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UsersModule } from './apps/users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
