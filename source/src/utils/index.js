const qs = require('querystring')

function tofixed(data) {
    return data.toString().length > 1 ? '' + data : '0' + data
}
export function formatTime(time) {
    if (!time) return ''
    let date = new Date(+time)
    let hours = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    return tofixed(hours) + ':' + tofixed(minute) + ':' + tofixed(second)
}
export function formatDate(time) {
    if (!time) return ''
    let date = new Date(+time)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '/' + tofixed(month) + '/' + tofixed(day)
}
export function query(url) {
    return qs.parse(url)
}
export function paramString(param) {
   return qs.stringify(param)
}
export function downloadExcel(opts) {

}
