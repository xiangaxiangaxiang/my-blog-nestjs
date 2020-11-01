import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { LikeType } from './enum'

@Entity()
export class Likes {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'uuid'})
    uid: string

    @Column({type: 'varchar', length: 100})
    targetId: string

    @Column({type: 'enum', enum: LikeType})
    type: number

    @CreateDateColumn()
    createdTime: Date

    @UpdateDateColumn()
    updatedTime: Date

    @DeleteDateColumn()
    deletedTime: Date

}