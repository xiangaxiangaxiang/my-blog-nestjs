import { User } from "src/apps/users/entity/users.entity";
import { Notification } from "../entity/nofitication.entity";

export interface GetNotification {
    total: number,
    notices: (Notification & {operationUserInfo: User | any, content:string})[]
}