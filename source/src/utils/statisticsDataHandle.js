import {formatDate} from '@/utils'
import {feeTypesEnum} from '@/dataMap'

// 获取按月统计月份范围
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
// 计算月份范围内个人统计数据
export function setPersonMonthsChartsData(data, l) {
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
// 计算月份范围内个人项目统计
export function setPersonProjectsChatsData(data) {
    let result = {
        x: [],
        data: []
    }
    data.forEach((item) => {
        let index = result.x.indexOf(`${item.pid}:${item.title}`)
        if (index === -1) {
            result.x.push(`${item.pid}:${item.title}`)
            result.data.push(+item.money)
        } else {
            result.data[index] += +item.money
        }
    })
    return result
}
// 计算月份范围内个人消费类型统计
export function setPersonTypeChartsData(data) {
    let x = []
    let result = []
    data.forEach((item) => {
        let index = x.indexOf(feeTypesEnum[item.type])
        if (index === -1) {
            x.push(feeTypesEnum[item.type])
            result.push({
                value: +item.money,
                name: feeTypesEnum[item.type]
            })
        } else {
            result[index].value += +item.money
        }
    })
    return {
        x: x,
        result: result
    }
}
