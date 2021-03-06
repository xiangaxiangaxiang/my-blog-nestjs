import { TargetType } from 'src/utils/common.enum'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Likes {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'uuid'})
    uid: string

    @Column({type: 'varchar', length: 100, name: 'target_id'})
    targetId: string

    @Column({type: 'enum', enum: TargetType})
    type: number

    @CreateDateColumn({name: 'created_time'})
    createdTime: Date

    @UpdateDateColumn({name: 'updated_time'})
    updatedTime: Date

    @DeleteDateColumn({name: 'deleted_time'})
    deletedTime: Date

}