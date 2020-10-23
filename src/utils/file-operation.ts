import fs from 'fs'
import path from 'path'
import config from 'src/config/config'

export class FileOperation {

    // 读取路径信息
    // eslint-disable-next-line @typescript-eslint/ban-types
    getStat (path:string):Promise<fs.Stats | Boolean> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err) {
                    resolve(false)
                } else {
                    resolve(stats)
                }
            })
        })
    }

    mkdir (dir:string) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, err => {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }

    async dirExists (dir) {
        const isExists = await this.getStat(dir)
        // 如果该路径且不是文件，返回true
        if (isExists && (isExists as fs.Stats).isDirectory()) {
            return true
        } else if (isExists) { // 如果该路径存在但是文件，返回false
            return false
        }
        // 如果该路径不存在
        const tempDir = path.parse(dir).dir // 拿到上级路径
        // 递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
        const status = await this.dirExists(tempDir)
        let mkdirStatus
        if (status) {
            mkdirStatus = await this.mkdir(dir)
        }
        return mkdirStatus
    }

    async upload(pathlist, savePath) {

        const dir = config.baseStaticPath + savePath
        await this.dirExists(dir)

        for (let i in pathlist) {
            const reader = fs.createReadStream(pathlist[i].filePath)
            const writer = fs.createWriteStream(config.baseStaticPath + pathlist[i].savePath)
            reader.pipe(writer)
        }

    }

}