import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { ArticleType } from "./enum"

@Entity()
export class Labels {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'enum', enum: ArticleType})
    type: number

    @Column({type: 'varchar', length: 100})
    label: string

    @CreateDateColumn()
    createdTime: Date

    @UpdateDateColumn()
    updatedTime: Date

    @DeleteDateColumn()
    deletedTime: Date

}