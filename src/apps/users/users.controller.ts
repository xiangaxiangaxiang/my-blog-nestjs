import { Body, Controller, HttpException, HttpStatus, Post, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/guard/JwtAuthGuard.guard';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserType } from './entity/type';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        readonly usersService:UsersService
    ){}

    @Post('register')
    userRegister(@Body() userRegisterDto: UserRegisterDto) {
        this.usersService.userRegister(userRegisterDto)
        throw new HttpException({message: '注册成功'}, HttpStatus.OK)
    }

    @Post('login')
    async userLogin(@Body() userLoginDto: UserLoginDto, @Response() response) {
        const userData = await this.usersService.userLogin(userLoginDto)
        const res = {
            message: '登陆成功',
            data: userData.user
        }
        response.cookie('jwt', userData.token, {httpOnly: true})
        throw new HttpException(res, HttpStatus.OK)
    }

}
