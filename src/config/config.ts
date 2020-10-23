const baseStaticPath = process.env.NODE_ENV === 'production' ?
    '/opt/static' :
    'E:/my-project/static'

export default {
    jwtSecret: 'lalalademaxiya',
    jwtexpiresIn: `${60*60*24}s`,
    baseStaticPath,
    adminSecret: 'lalalademaxiyawansui!!!'
}