import { UserStatus, UserType } from "../entity/enum";

export interface UserLogin {
    user: {
        uid: string,
        nickname: string,
        avatar: string,
        account: string,
        userType: UserType,
        enable: UserStatus
    },
    token: string
}