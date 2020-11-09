import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Request, Response, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { JwtAuthGuard } from 'src/guard/Jwt-auth-guard.guard';
import { PaginationDto } from 'src/utils/pagination.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserIdDto } from './dto/user-id.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserType } from './entity/enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService:UsersService
    ){}

    @Post('register')
    async userRegister(@Body() userRegisterDto: UserRegisterDto) {
        await this.usersService.userRegister(userRegisterDto)
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

    @Post('admin_register')
    async adminRegister(@Body() adminRegisterDto: AdminRegisterDto) {
        await this.usersService.adminRegister(adminRegisterDto)
        throw new HttpException({message: '注册成功'}, HttpStatus.OK)
    }

    @Post('admin_login')
    async adminLogin(@Body() userLoginDto: UserLoginDto, @Response() response) {
        const userData = await this.usersService.adminLogin(userLoginDto)
        const res = {
            message: '登陆成功',
            data: userData.user
        }
        response.cookie('jwt', userData.token, {httpOnly: true})
        throw new HttpException(res, HttpStatus.OK)
    }
    
    @Post('logout')
    async userLoyout(@Response() response) {
        response.cookie('jwt', '', {expires: new Date(0)})
        throw new HttpException({message: '用户已登出'}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.USER))
    @Post('update_password')
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
        await this.usersService.updatePassword(updatePasswordDto)
        throw new HttpException({message: '密码修改成功'}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.USER))
    @Post('update_nickname')
    async updateUserInfo(@Request() req, @Body() updateNicknameDto: UpdateNicknameDto) {
        await this.usersService.updateNickname(req.user.uid, updateNicknameDto.nickname)
        throw new HttpException({message: '昵称修改成功'}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.USER))
    @Post('update_avatar')
    @UseInterceptors(FileInterceptor('file'))
    async updateAvatar(@Request() req, @UploadedFile() avatar) {
        if (!avatar) {
            throw new HttpException({message: '请上传一个图片文件'}, HttpStatus.BAD_REQUEST)
        }
        if (avatar.size > 1024 * 1024 *2) {
            throw new HttpException({message: '文件不能超过2M'}, HttpStatus.BAD_REQUEST)
        }
        const newAvatar = await this.usersService.updateAvatar(req.user.uid, avatar)
        const res = {
            message: '头像修改成功',
            data: {
                avatar: newAvatar
            }
        }
        throw new HttpException(res, HttpStatus.OK)
    }

    // @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    @Get('list')
    async getUserList(@Query() paginationDto:PaginationDto) {
        const {users, total} = await this.usersService.getUserList(paginationDto)
        throw new HttpException({data: { users, total }}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    @Post('disable')
    async banUser(@Body() userIdDto:UserIdDto) {
        await this.usersService.banUser(userIdDto)
        throw new HttpException({message: '已禁用该用户'}, HttpStatus.OK)
    }

    @UseGuards(new JwtAuthGuard(UserType.ADMIN))
    @Post('enable')
    async unblockUser(@Body() userIdDto:UserIdDto) {
        await this.usersService.unblockUser(userIdDto)
        throw new HttpException({message: '用户已被解除禁用'}, HttpStatus.OK)
    }

}
