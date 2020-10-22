import { BeforeInsert, Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs'
import { UserStatus, UserType } from './type'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Generated('uuid')
    uid: string

    @Column({length: 32})
    nickname: string

    @Column({length: 500, type: 'varchar'})
    avatar: string

    @Column({length: 32, unique: true})
    account: string

    @Column({type: 'enum', enum: UserType, name: 'user_type'})
    userType: number

    @Column({length: 120})
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    @Column({type: 'enum', enum: UserStatus})
    enable: number

}