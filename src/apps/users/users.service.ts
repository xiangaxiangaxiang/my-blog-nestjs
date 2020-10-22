import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import {JwtService} from "@nestjs/jwt"
import * as bcrypt from 'bcryptjs'

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserStatus, UserType } from './entity/type';
import { User } from './entity/users.entity';
import { UserLogin } from './interface/users.interface';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ){}

    async getUser(account:string) {
        const user = await this.usersRepository.createQueryBuilder('user').select().where({account}).getOne()
        return user
    }

    async addUser(user) {
        const newUser = this.usersRepository.create(user)
        await this.usersRepository.save(newUser)
    }

    getDefaultAvatar() {
        return `/img/avatar/default_${ Math.floor(Math.random() * 5) + 1 }.jpg`
    }

    async userRegister(userRegisterDto:UserRegisterDto) {
        const userExist = await this.getUser(userRegisterDto.account)
        if (userExist) {
            throw new HttpException({message: '用户已存在'}, HttpStatus.BAD_REQUEST)
        }
        const user = Object.assign({}, userRegisterDto, {
            avatar: this.getDefaultAvatar(),
            userType: UserType.USER,
            enable: UserStatus.enable
        })
        await this.addUser(user)
    }

    async userLogin(userLoginDto: UserLoginDto):Promise<UserLogin> {
        const user = await this.getUser(userLoginDto.account)
        if (!user) {
            throw new HttpException({message: '用户未注册'}, HttpStatus.NOT_FOUND)
        }
        const correct = bcrypt.compareSync(userLoginDto.password, user.password)
        if (user.enable === UserStatus.disable) {
            throw new HttpException({message:'用户已被禁用'}, HttpStatus.UNAUTHORIZED)
        }
        if (!correct) {
            throw new HttpException({message:'密码错误'}, HttpStatus.UNAUTHORIZED)
        }
        const payload = {
            uid: user.uid,
            userType: user.userType,
            account: user.account
        }
        const token = this.jwtService.sign(payload)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {id, password, ...userData} = user
        return {
            user: userData,
            token
        }
    }

}
