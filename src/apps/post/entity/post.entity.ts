import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { PostStatus, PostType } from "./enum"

@Entity()
export class Posts {

    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'post_id'})
    @Generated('uuid')
    postId: string

    @Column({type: 'varchar', length: 500})
    content: string

    @Column({type: 'enum', enum: PostType, name: 'post_type'})
    postType: number

    @Column({type: 'simple-array'})
    urls: string

    @Column({type: 'int', default: 0, name: 'like_nums'})
    likeNums: number

    @Column({type: 'enum', enum: PostStatus, name: 'like_nums'})
    status: number

    @CreateDateColumn({name: 'created_time'})
    createdTime: Date

    @UpdateDateColumn({name: 'updated_time'})
    updatedTime: Date

    @DeleteDateColumn({name: 'deleted_time'})
    deletedTime: Date

}