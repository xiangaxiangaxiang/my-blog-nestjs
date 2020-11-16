import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Statistics {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'date', unique: true})
    date: Date

    @Column({type: 'int', name: 'web_hits', default: 0})
    webHits: number

    @Column({type: 'int', default: 0})
    likes: number

    @Column({type: 'int', default: 0})
    comments: number

    @Column({type: 'int', name: 'article_hits', default: 0})
    articleHits: number

    @CreateDateColumn({name: 'created_time'})
    createdTime: Date

    @UpdateDateColumn({name: 'updated_time'})
    updatedTime: Date

    @DeleteDateColumn({name: 'deleted_time'})
    deletedTime: Date

}