import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { FindManyOptions, Like, Repository } from 'typeorm';
import {JwtService} from "@nestjs/jwt"
import * as bcrypt from 'bcryptjs'

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserStatus, UserType } from './entity/enum';
import { User } from './entity/users.entity';
import { UserLogin } from './interface/users.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FileOperation } from 'src/utils/file-operation';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { UserIdDto } from './dto/user-id.dto';

@Injectable()
export class UsersService {
    fileOperation: FileOperation;

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ){
        this.fileOperation = new FileOperation()
    }

    async getUser(filter:{uid?:string, account?:string}) {
        const user = await this.usersRepository.createQueryBuilder('user').select().where(filter).getOne()
        return user
    }

    async addUser(user) {
        const newUser = this.usersRepository.create(user)
        await this.usersRepository.save(newUser)
    }

    private _getDefaultAvatar() {
        return `/img/avatar/default_${ Math.floor(Math.random() * 5) + 1 }.jpg`
    }

    async adminRegister(adminRegisterDto:AdminRegisterDto) {
        const userExist = await this.getUser({account: adminRegisterDto.account})
        if (userExist) {
            throw new HttpException({message: '用户已存在'}, HttpStatus.BAD_REQUEST)
        }
        const {adminSecret, ...data} = adminRegisterDto
        const admin = Object.assign(data, {
            avatar: this._getDefaultAvatar(),
            userType: UserType.ADMIN,
            enable: UserStatus.ENABLE
        })
        await this.addUser(admin)
    }

    async userRegister(userRegisterDto:UserRegisterDto) {
        const userExist = await this.getUser({account: userRegisterDto.account})
        if (userExist) {
            throw new HttpException({message: '用户已存在'}, HttpStatus.BAD_REQUEST)
        }
        const user = Object.assign(userRegisterDto, {
            avatar: this._getDefaultAvatar(),
            userType: UserType.USER,
            enable: UserStatus.ENABLE
        })
        await this.addUser(user)
    }

    private _validateUser(user:User, password?:string) {
        if (!user) {
            throw new HttpException({message: '用户未注册'}, HttpStatus.NOT_FOUND)
        }
        if (user.enable === UserStatus.DISABLE) {
            throw new HttpException({message:'用户已被禁用'}, HttpStatus.UNAUTHORIZED)
        }
        if (password) {
            const correct = bcrypt.compareSync(password, user.password)
            if (!correct) {
                throw new HttpException({message:'密码错误'}, HttpStatus.UNAUTHORIZED)
            }
        }
    }

    private _generateToken(user:User):string {
        const payload = {
            uid: user.uid,
            userType: user.userType,
            account: user.account
        }
        return this.jwtService.sign(payload)
    } 

    async adminLogin(userLoginDto:UserLoginDto):Promise<UserLogin> {
        const user = await this.getUser({account: userLoginDto.account})
        if (user.userType !== UserType.ADMIN) {
            throw new HttpException({message: '无权登陆'}, HttpStatus.UNAUTHORIZED)
        }
        this._validateUser(user, userLoginDto.password)
        const token = this._generateToken(user)
        const {id, password, ...userData} = user
        return {
            user: userData,
            token
        }
    }

    async userLogin(userLoginDto: UserLoginDto):Promise<UserLogin> {
        const user = await this.getUser({account: userLoginDto.account})
        this._validateUser(user, userLoginDto.password)
        const token = this._generateToken(user)
        const {id, password, ...userData} = user
        return {
            user: userData,
            token
        }
    }

    async updatePassword(updatePasswordDto:UpdatePasswordDto) {
        const user = await this.getUser({uid: updatePasswordDto.uid})
        this._validateUser(user, updatePasswordDto.oldPassword)
        user.password = updatePasswordDto.newPassword
        await this.usersRepository.save(user)
    }

    async updateNickname(uid:string, nickname: string) {
        const user = await this.getUser({uid})
        this._validateUser(user)
        this.usersRepository.update(user.id, {nickname})
    }

    async updateAvatar(uid: string, avatar:any):Promise<string> {
        const user = await this.getUser({uid})
        this._validateUser(user)
        const suffix = avatar.name.split('.').pop()
        const avatarPath = `/img/avatar/avatar_${uid}.${suffix}`
        const filelist = [{
            filePath: avatar.path,
            savePath: avatarPath
        }]
        this.fileOperation.upload(filelist, '/img/avatar')
        this.usersRepository.update(user.id, {avatar: avatarPath})
        return avatarPath
    }

    async getUserList(paginationDto:PaginationDto):Promise<{users: User[], total: number}> {
        const filter:FindManyOptions<User> = {
            select: ['id', 'uid', 'nickname', 'account', 'avatar', 'userType', 'enable'],
            skip: paginationDto.offset,
            take: paginationDto.limit,
            order: {
                [paginationDto.sortName]: paginationDto.orderName
            }
        }
        if (paginationDto.searchText) {
            filter.where = {
                nickname: Like(`%${paginationDto.searchText}%`)
            }
        }
        const [users, total] = await this.usersRepository.findAndCount(filter)
        return {users, total}
    }

    async banUser(userIdDto:UserIdDto) {
        const user = await this.getUser({uid: userIdDto.uid})
        if (!user) {
            throw new HttpException({message:'用户不存在'}, HttpStatus.BAD_REQUEST)
        }
        user.enable = UserStatus.DISABLE
        this.usersRepository.save(user)
    }

    async unblockUser(userIdDto:UserIdDto) {
        const user = await this.getUser({uid: userIdDto.uid})
        if (!user) {
            throw new HttpException({message:'用户不存在'}, HttpStatus.BAD_REQUEST)
        }
        user.enable = UserStatus.ENABLE
        this.usersRepository.save(user)
    }

}
