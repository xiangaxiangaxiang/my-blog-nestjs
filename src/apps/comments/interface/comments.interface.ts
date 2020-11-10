import { User } from "src/apps/users/entity/users.entity";
import { IsDelete } from "../entity/enum";

export interface AddComment {
    comment: {
        uniqueId: string,
        commentId: string,
        targetId: string,
        content: string,
        likeNums: number,
        createdTime: Date,
        isDeleted: IsDelete,
        likeStatus: boolean,
        userInfo: User,
        replyUserInfo: User | unknown,
        replyComments: [] | null
    }
}