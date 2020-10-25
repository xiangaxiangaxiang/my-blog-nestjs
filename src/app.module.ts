import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UsersModule } from './apps/users/users.module';
import { ArticlesModule } from './apps/articles/articles.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, ArticlesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
