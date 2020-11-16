import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ArticleType, ReleaseStatus } from "./enum";

@Entity()
export class Article {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', length: 25, unique: true, name: 'article_id'})
    articleId:string

    @Column({type: 'varchar', length: 50, nullable: false})
    title: string

    @Column({type: 'enum', enum: ArticleType, name: 'article_type'})
    articleType: number

    @Column({type: 'simple-array', nullable: false})
    labels: string

    @Column({type: 'longtext', nullable: false})
    html: string

    @Column({type: 'longtext', nullable: false})
    markdown: string

    @Column({type: 'varchar', length: 300, nullable: false})
    content: string

    @Column({name: 'release_status', type: 'enum', enum: ReleaseStatus})
    releaseStatus: number

    @Column({name: 'like_nums', type: 'int', default: 0})
    likeNums: number

    @Column({name: 'click_nums', type: 'int', default: 0})
    clickNums: number

    @Column({name: 'comment_nums', type: 'int', default: 0})
    commentNums: number

    @Column({name: 'first_image', type: 'varchar', default: ''})
    firstImage: string

    @CreateDateColumn({name: 'created_time'})
    createdTime: Date

    @UpdateDateColumn({name: 'updated_time'})
    updatedTime: Date

    @DeleteDateColumn({name: 'deleted_time'})
    deletedTime: Date
    
}