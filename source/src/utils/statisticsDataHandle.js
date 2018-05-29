import {formatDate, resolveFloat} from '@/utils'
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
export function getYearAbs(start, end) {
    return new Promise((resolve, reject) => {
        if (!!start && !!end && start <= end) {
            let sbscissa = []
            start = new Date(+start).getFullYear()
            end = new Date(+end).getFullYear()
            for (let i = start; i <= end; i++) {
                sbscissa.push(i)
            }
            resolve(sbscissa)
        } else {
            resolve([])
        }
    })
}
// 计算月份范围内统计数据
export function setPersonMonthsChartsData(data, l) {
    let result = new Array(l.length).fill(0)
    let allResult = new Array(l.length).fill(0)
    data.forEach((item) => {
        let date = formatDate(item.startDate || item.reqStart).split('/')
        let position = l.indexOf(date[0] + '-' + date[1])
        if (position !== -1) {
            allResult[position] = resolveFloat(allResult[position], Number(item.money))
            if (item.state >= 4) {
                result[position] = resolveFloat(result[position], Number(item.money))
            }
        }
    })
    return {
        result: result,
        allResult: allResult
    }
}
// 计算时间范围内项目统计
export function setProjectsChatsData(data) {
    let result = {
        x: [],
        data: [],
        allData: []
    }
    data.forEach((item) => {
        let index = result.x.indexOf(`${item.pid}:${item.title}`)
        if (index === -1) {
            result.x.push(`${item.pid}:${item.title}`)
            result.allData.push(+item.money)
            if (item.state >= 4) {
                result.data.push(+item.money)
            }
        } else {
            result.allData[index] = resolveFloat(result.allData[index], +item.money)
            if (item.state >= 4) {
                result.data[index] = resolveFloat(result.data[index], +item.money)
            }
        }
    })
    return result
}
// 计算时间范围消费类型统计
export function setTypeChartsData(data) {
    let x = []
    let result = []
    data.forEach((item) => {
        let index = x.indexOf(`${item.type}:${feeTypesEnum[item.type]}`)
        if (index === -1) {
            x.push(`${item.type}:${feeTypesEnum[item.type]}`)
            result.push({
                value: +item.money,
                name: `${item.type}:${feeTypesEnum[item.type]}`
            })
        } else {
            result[index].value = resolveFloat(result[index].value, +item.money)
        }
    })
    return {
        x: x,
        result: result
    }
}
// 计算年度范围内个人统计
export function setYearData(data, l) {
    let result = new Array(l.length).fill(0)
    let allResult = new Array(l.length).fill(0)
    data.forEach((item) => {
        let year = new Date(+item.startDate).getFullYear()
        let index = l.indexOf(year)
        if (index !== -1) {
            allResult[index] = resolveFloat(allResult[index], +item.money)
            if (item.state >= 4) {
                result[index] = resolveFloat(result[index], +item.money)
            }
        }
    })
    return {
        allResult: allResult,
        result: result
    }
}
