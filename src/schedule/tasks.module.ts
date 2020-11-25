import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Statistics } from "src/apps/statistics/entity/statistics.entity";
import { TasksService } from "./tasks.service";

@Module({
    imports: [TypeOrmModule.forFeature([Statistics])],
    providers: [TasksService],
})
export class TasksModule {}