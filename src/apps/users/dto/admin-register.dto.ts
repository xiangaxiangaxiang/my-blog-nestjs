import { Equals } from "class-validator";
import config from "src/config/config";
import { UserRegisterDto } from "./user-register.dto";

export class AdminRegisterDto extends UserRegisterDto {

    @Equals(config.adminSecret, {message: '你想做甚？造反吗？'})
    adminSecret: string

}