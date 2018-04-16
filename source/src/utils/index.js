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
export function getMonthAbs(start, end) {
    return new Promise((resolve, reject) => {
                if (!!start && !!end) {
                    let sbscissa = []
                    start = formatDate(start)
                    end = formatDate(end)
                    let i = start.split('/')
                    let j = end.split('/')
                    i.splice(2, 1)
                    j.splice(2, 1)
                    sbscissa.push(i.join('-'))
                    while (i[0] < j[0] || i[1] < j[1]) {
                        i[1] = Number(i[1]) + 1
                        if (Number(i[1]) > 12) {
                            i[0] = Number(i[0]) + 1
                            i[1] = 1
                        }
                        if (i[1] < 10) {
                            i[1] = '0' + i[1]
                        }
                        sbscissa.push(i.join('-'))
                    }
                    resolve(sbscissa)
                }
                reject(new Error('can not create sbscissa'))
            })
}
export function setChartsDate(data, l) {
    let result = new Array(l.length).fill(0)
    for (let item of data) {
        let date = formatDate(item.startDate).split('/')
        let position = l.indexOf(date[0] + '-' + date[1])
        if (position !== -1) {
            result[position] += Number(item.money)
        }
    }
    return result
}
