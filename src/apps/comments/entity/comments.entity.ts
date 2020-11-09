import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsDelete } from "./enum";

@Entity()
export class Comments {

    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'unique_id'})
    @Generated('uuid')
    uniqueId: string

    @Column({name: 'comment_id', type: 'varchar', length: 50})
    commentId: string

    @Column({name: 'target_id', type: 'varchar', length: 50})
    targetId: string

    @Column({type: 'varchar', length: 500})
    content: string

    @Column({type: 'uuid'})
    uid: string

    @Column({type: 'uuid', nullable: true})
    replyUid: string

    @Column({type: 'enum', enum: IsDelete})
    isDeleted: number

    @Column({type: 'int', default: 0})
    likeNums: number

    @CreateDateColumn({name: 'created_time'})
    createdTime: Date

    @UpdateDateColumn({name: 'updated_time'})
    updatedTime: Date

    @DeleteDateColumn({name: 'deleted_timer'})
    deletedTime: Date

}