export const stampToStr = function (time:Date|number, accuracy = 'second') {
    if (!time) {
        return '-'
    }
    if (Number.isInteger(time)) {
        time = parseInt(time.toString().padEnd(13, '000'))
    }
    const d = new Date(time)
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const date = d.getDate().toString().padStart(2, '0')
    const hour = d.getHours().toString().padStart(2, '0')
    const minute = d.getMinutes().toString().padStart(2, '0')
    const second = d.getSeconds().toString().padStart(2, '0')
    let str
    if (accuracy === 'second') {
        str = `${year}-${month}-${date} ${hour}:${minute}:${second}`
    } else {
        str = `${year}-${month}-${date}`
    }
    return str
}