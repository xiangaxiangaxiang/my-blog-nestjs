import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Statistics {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'date', unique: true})
    date: Date

    @Column({type: 'int', name: 'web_hits'})
    webHits: number

    @Column({type: 'int'})
    likes: number

    @Column({type: 'int'})
    comments: number

    @Column({type: 'int', name: 'article_hits'})
    articleHits: number

    @CreateDateColumn({name: 'created_time'})
    createdTime: Date

    @UpdateDateColumn({name: 'updated_time'})
    updatedTime: Date

    @DeleteDateColumn({name: 'deleted_timer'})
    deletedTime: Date

}