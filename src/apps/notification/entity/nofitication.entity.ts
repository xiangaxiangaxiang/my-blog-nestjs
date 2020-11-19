import { TargetType } from 'src/utils/common.enum'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { NotificationType, ReadStatus } from './enum'


@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'target_id', type: 'varchar', length: 100})
    targetId: string

    @Column({name: 'target_type', type: 'enum', enum: TargetType})
    targetType: number

    @Column({type: 'enum', enum: NotificationType})
    type: number

    @Column({name: 'operation_uid', type: 'uuid'})
    operationUid: string

    @Column({type: 'uuid'})
    uid: string

    @Column({name: 'read_status', type: 'enum', enum: ReadStatus, default: ReadStatus.UNREAD})
    readStatus: number

    @CreateDateColumn({name: 'created_time'})
    createdTime: Date

    @UpdateDateColumn({name: 'updated_time'})
    updatedTime: Date

    @DeleteDateColumn({name: 'deleted_time'})
    deletedTime: Date

}