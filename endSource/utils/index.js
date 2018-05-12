const xlsx = require('xlsx-style')
const path = require('path')

const feeTypesEnum = {
    30: '火车',
    31: '轮船',
    32: '飞机',
    33: '汽车',
    34: '其它',
    10: '住宿费',
    20: '行李费',
    21: '民航车费',
    22: '航空保险',
    23: '邮电费',
    24: '文具资料费',
    25: '其它非交通费用'
}

const seat = {
    30: [
        {
            label: '火车软席',
            value: 0
        },
        {
            label: '高铁动车商务座',
            value: 1
        },
        {
            label: '全列软席列车一等软座',
            value: 2
        },
        {
            label: '高铁列车一等座',
            value: 3
        },
        {
            label: '火车硬席',
            value: 4
        },
        {
            label: '高铁动车二等座',
            value: 5
        },
        {
            label: '全列软席列车二等软座',
            value: 6
        },
        {
            label: '夕发朝至直达特快全列软卧',
            value: 7
        }
    ],
    31: [
        {
            label: '一等舱',
            value: 0
        },
        {
            label: '二等舱',
            value: 1
        },
        {
            label: '三等舱',
            value: 2
        }
    ],
    32: [
        {
            label: '头等舱',
            value: 0
        },
        {
            label: '商务舱',
            value: 1
        },
        {
            label: '经济舱',
            value: 2
        }
    ]
}
// 浮点数运算
function resolveFloat(base, increment, operator = '+') {
    if (Array.isArray(base)) {
        operator = increment || operator
        return base.reduce((first, second) => {
            return resolveFloat(first, second, operator)
        })
    } else {
        // 转换成字符串
        base = '' + base
        increment = '' + increment
        // 计算小数点移动位数
        let dig = base.split('.')[1] && base.split('.')[1].length || 0
        let dig2 = increment.split('.')[1] && increment.split('.')[1].length || 0
        let max = Math.max(dig, dig2)
        let diff = dig - dig2
        // 位数补全
        base = base.replace('.', '')
        increment = increment.replace('.', '')
        if (diff >= 0) {
            let cm = Math.pow(10, diff)
            increment = Number(increment) * cm
        } else {
            let cm = Math.pow(10, -diff)
            base = Number(base) * cm
        }
        switch (operator) {
            case '+':
                base = (+base) + (+increment)
                return base / Math.pow(10, max)
            case '-':
                base = (+base) - (+increment)
                return base / Math.pow(10, max)
            case '*':
                base = (+base) * (+increment)
                return base / Math.pow(10, dig + dig2)
            default:
                throw new Error('unexpected operator')
        }
    }
}

function nToC(num) {
    num = +num
    let result = ''
    let unit = ['', '萬', '亿']
    let enm = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    let s = num.toString()
    if (s.length >= 9) {
        let remain = `${+s.slice(-8)}`
        if (remain.length === 8) {
            result = nToC(s.slice(0, -8)) + '亿' + nToC(s.slice(-8))
        } else if (remain.length === 0) {
            result = nToC(s.slice(0, -8)) + '亿'
        } else {
            result = nToC(s.slice(0, -8)) + '亿零' + nToC(s.slice(-8))
        }
    } else if (s.length >= 5) {
        let remain = `${+s.slice(-4)}`
        if (remain.length === 4) {
            result = nToC(+s.slice(0, -4)) + '萬' + nToC(+s.slice(-4))
        } else if (remain.length === 0) {
            result = nToC(+s.slice(0, -4)) + '萬'
        } else {
            result = nToC(+s.slice(0, -4)) + '萬零' + nToC(+s.slice(-4))
        }
    } else {
        let thousand = Math.floor(num/1000)
        let hundred = Math.floor((num%1000)/100)
        let ten = Math.floor((num%100)/10)
        let one = num % 10
        if (num === 0) {
            return '零'
        }
        if (!!thousand) {
            result += enm[thousand] + '仟'
        }
        if (num % 1000 === 0) {
            return result
        }
        if (!!hundred) {
            result += enm[hundred] + '佰'
        } else if (!!result) {
            result += enm[0]
        }
        if (num % 100 === 0) {
            return result
        }
        if (!!ten) {
            result += enm[ten] + '拾'
        } else if (!!result && !!hundred) {
            result += enm[0]
        }
        if (!!one) {
            result += enm[one]
        } else if (!result) {
            result += enm[0]
        }
    }
    return result
}

function setSeat(type, s) {
    if (!!s) {
        return seat[type][s].label
    }
    return ''
}

function tofixed(data) {
    return data.toString().length > 1 ? '' + data : '0' + data
}

let formatDate = function(time) {
    if (!time) return ''
    let date = new Date(+time)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '/' + tofixed(month) + '/' + tofixed(day)
}

let formatTime = function(time) {
    if (!time) return ''
    let date = new Date(+time)
    let hours = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    return tofixed(hours) + ':' + tofixed(minute) + ':' + tofixed(second)
}

exports.createPersonReim = function (reims, time, requestion) {
    let l = reims.length
    let trL = l >= 7 ? l : 7
    let acount = function() {
        if (reims.length === 0) {
            return 0
        } else if (reims.length === 1) {
            return reims[0].money
        }
        return reims.reduce((base, reim) => {
            base = base.money || base
            return base + reim.money
        })
    }
    let cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    let cellStyle = {
        font: {
            name: '微软雅黑',
            sz: '11',
            bold: true
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        border: {}
    }
    let st = {
        '!ref': 'A1:I' + (9 + trL),
        A1: {
            t: 's',
            v: `${requestion.laboratory}差旅费用报销单 单号`,
            s: {
                font: {
                    name: '微软雅黑',
                    sz: '16'
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }
            }
        },
        A2: {
            t: 's',
            v: '出差人员',
            s: cellStyle
        },
        B2: {
            t: 's',
            v: requestion.name,
            s: cellStyle
        },
        E2: {
            t: 's',
            v: '出发时间',
            s: cellStyle
        },
        A3: {
            t: 's',
            v: '所属研究室',
            s: cellStyle
        },
        E3: {
            t: 's',
            v: '主要工作内容',
            s: cellStyle
        },
        A4: {
            t: 's',
            v: '项目卡号　（不填）',
            s: {
                ...cellStyle,
                alignment: {
                    vertical: 'center'
                }
            }
        },
        A5: {
            t: 's',
            v: '序号',
            s: cellStyle
        },
        C5: {
            t: 's',
            v: '费用类型',
            s: cellStyle
        },
        D5: {
            t: 's',
            v: '发生时间',
            s: cellStyle
        },
        F5: {
            t: 's',
            v: '费用描述',
            s: cellStyle
        },
        H5: {
            t: 's',
            v: '金额',
            s: cellStyle
        },
        I5: {
            t: 's',
            v: '备注',
            s: cellStyle
        },
        ['A' + (6 + trL)]: {
            t: 's',
            v: '票据提交时间',
            s: cellStyle
        },
        ['D' + (6 + trL)]: {
            t: 's',
            v: time || '',
            s: cellStyle
        },
        ['F' + (6 + trL)]: {
            t: 's',
            v: '费用总计',
            s: cellStyle
        },
        ['H' + (6 + trL)]: {
            t: 's',
            v: '￥' + acount(),
            s: cellStyle
        },
        ['A' + (8 + trL)]: {
            t: 's',
            v: '费用审批结果',
            s: cellStyle
        },
        ['F' + (8 + trL)]: {
            t: 's',
            v: '票据审核结果',
            s: cellStyle
        },
        ['A' + (9 + trL)]: {
            t: 's',
            v: '审核人签名',
            s: cellStyle
        },
        ['F' + (9 + trL)]: {
            t: 's',
            v: '报销打款时间',
            s: cellStyle
        },
        '!merges': [
            {
                s: {
                    c: 0,
                    r: 0
                },
                e: {
                    c: 8,
                    r: 0
                }
            },
            {
                s: {
                    c: 1,
                    r: 1
                },
                e: {
                    c: 3,
                    r: 1
                }
            },
            {
                s: {
                    c: 4,
                    r: 1
                },
                e: {
                    c: 5,
                    r: 1
                }
            },
            {
                s: {
                    c: 4,
                    r: 2
                },
                e: {
                    c: 5,
                    r: 2
                }
            },
            {
                s: {
                    c: 6,
                    r: 1
                },
                e: {
                    c: 8,
                    r: 1
                }
            },
            {
                s: {
                    c: 1,
                    r: 2
                },
                e: {
                    c: 3,
                    r: 2
                }
            },
            {
                s: {
                    c: 6,
                    r: 2
                },
                e: {
                    c: 8,
                    r: 2
                }
            },
            {
                s: {
                    c: 0,
                    r: 3
                },
                e: {
                    c: 8,
                    r: 3
                }
            },
            {
                s: {
                    c: 0,
                    r: 5 + trL
                },
                e: {
                    c: 2,
                    r: 5 + trL
                }
            },
            {
                s: {
                    c: 3,
                    r: 5 + trL
                },
                e: {
                    c: 4,
                    r: 5 + trL
                }
            },
            {
                s: {
                    c: 5,
                    r: 5 + trL
                },
                e: {
                    c: 6,
                    r: 5 + trL
                }
            },
            {
                s: {
                    c: 7,
                    r: 5 + trL
                },
                e: {
                    c: 8,
                    r: 5 + trL
                }
            },
            {
                s: {
                    c: 0,
                    r: 6 + trL
                },
                e: {
                    c: 8,
                    r: 6 + trL
                }
            },
            {
                s: {
                    c: 0,
                    r: 7 + trL
                },
                e: {
                    c: 2,
                    r: 7 + trL
                }
            },
            {
                s: {
                    c: 3,
                    r: 7 + trL
                },
                e: {
                    c: 4,
                    r: 7 + trL
                }
            },
            {
                s: {
                    c: 5,
                    r: 7 + trL
                },
                e: {
                    c: 7,
                    r: 7 + trL
                }
            },
            {
                s: {
                    c: 0,
                    r: 8 + trL
                },
                e: {
                    c: 2,
                    r: 8 + trL
                }
            },
            {
                s: {
                    c: 3,
                    r: 8 + trL
                },
                e: {
                    c: 4,
                    r: 8 + trL
                }
            },
            {
                s: {
                    c: 5,
                    r: 8 + trL
                },
                e: {
                    c: 7,
                    r: 8 + trL
                }
            }
        ],
        '!cols':{
            width: '9',
            hidden: '1',
            customWidth: '1',
            wpx: 54,
            wch: 8.17,
            MDW: 6
        }
    }
    for (let i = 0; i <= trL; i ++) {
        st['!merges'].push(
            {
                s: {
                    c: 0,
                    r: i + 4
                },
                e: {
                    c: 1,
                    r: i + 4
                }
            },
            {
                s: {
                    c: 3,
                    r: i + 4
                },
                e: {
                    c: 4,
                    r: i + 4
                }
            },
            {
                s: {
                    c: 5,
                    r: i + 4
                },
                e: {
                    c: 6,
                    r: i + 4
                }
            }
        )
    }
    for (let i = 0; i < l; i ++) {
        let cellObj = {
            [`A${i + 6}`]: {
                t: 's',
                v: 1 + i,
                s: cellStyle
            },
            [`C${i + 6}`]: {
                t: 's',
                v: feeTypesEnum[reims[i].type],
                s: cellStyle
            },
            [`D${i + 6}`]: {
                t: 's',
                v: formatDate(reims[i].startDate) + ' ' + formatTime(reims[i].startTime),
                s: cellStyle
            },
            [`F${i + 6}`]: {
                t: 's',
                v: reims[i].desc,
                s: cellStyle
            },
            [`H${i + 6}`]: {
                t: 'n',
                v: +reims[i].money,
                s: cellStyle
            },
            [`I${i + 6}`]: {
                t: 's',
                v: reims[i].note,
                s: cellStyle
            }
        }
        Object.assign(st, cellObj)
    }
    for (let i = 2; i <= 9 + trL; i ++) {
        for (let col of cols) {
            if (!!st[`${col}${i}`]) {
                st[`${col}${i}`].s.border.top = {
                    style: 'thin',
                    color: '000000'
                }
                st[`${col}${i}`].s.border.bottom = {
                    style: 'thin',
                    color: '000000'
                }
            } else {
                st[`${col}${i}`] = {
                    v: '',
                    s: {
                        border: {
                            top: {
                                style: 'thin',
                                color: '000000'
                            },
                            bottom: {
                                style: 'thin',
                                color: '000000'
                            }
                        }
                    }
                }
            }
        }
    }

    let workbook = {
        SheetNames: ['sheet1'],
        Sheets: {
            'sheet1': st
        }
    }
    let filename = (Date.now() + requestion.id + Math.random()).toString(16) + 'finance'

    xlsx.writeFile(workbook, path.resolve(__dirname, `../static/reimExcel/${filename}.xlsx`))
    return `/static/reimExcel/${filename}.xlsx`
}

exports.createFinanceReim = function (reims, time, requestion) {
    // 交通费用
    let transportation = reims.filter((item) => {
        if (item.type >= 30 && item.type < 34) {
            return true
        }
        return false
    })
    // 住宿费用
    let hotel = reims.filter((item) => {
        if (item.type >= 10 && item.type < 20) {
            return true
        }
        return false
    })
    // 其他费用
    let other = reims.filter((item) => {
        if (item.type >= 20 && item.type < 30) {
            return true
        }
        return false
    })
    // 不同报销费用
    // let special = reims.filter((item) => {
    //     if (item.type === 34) {
    //         return true
    //     }
    //     return false
    // })
    let l = transportation.length > hotel.length ? transportation.length : hotel.length
    let trL = l >= 11 ? l : 11
    let transportAcount = function() {
        if (transportation.length === 0) {
            return '0.00'
        } else if (transportation.length === 1) {
            return transportation[0].money.toFixed(2)
        }
        let result = transportation.reduce((base, reim) => {
            base = base.money || base
            return resolveFloat(base, reim.money)
        })
        return result.toFixed(2)
    }
    let hotelAcount = function() {
        if (hotel.length === 0) {
            return '0.00'
        } else if (hotel.length === 1) {
            return hotel[0].money.toFixed(2)
        }
        let result = hotel.reduce((base, reim) => {
            base = base.money || base
            return resolveFloat(base, reim.money)
        })
        return result.toFixed(2)
    }
    let otherAcount = function() {
        let result = new Array(6).fill(0)
        other.forEach(item => {
            result[item.type%20] = resolveFloat(result[item.type%20], item.money)
        })
        return result
    }
    let cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    let cellStyle = {
        font: {
            name: '宋体',
            sz: '10.5',
            bold: true
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            top: {
                style: 'thin',
                color: '000000'
            },
            left: {
                style: 'thin',
                color: '000000'
            },
            right: {
                style: 'thin',
                color: '000000'
            },
            bottom: {
                style: 'thin',
                color: '000000'
            }
        }
    }
    let otherAcountEnum = otherAcount()
    let otherAcountMoney
    if (!otherAcountEnum.length) {
        otherAcountMoney = '0.00'
    } else {
        otherAcountMoney = otherAcountEnum.reduce((base, incre) => {
            return base + incre
        }).toFixed(2)
    }
    let allMoney = resolveFloat([+transportAcount(), +hotelAcount(), +otherAcountMoney])
    let st = {
        '!ref': 'A1:L' + (10 + trL),
        A1: {
            t: 's',
            v: `哈尔滨工业大学（威海）差旅费审批报销单`,
            s: {
                font: {
                    name: '宋体',
                    sz: '16',
                    underline: true
                },
                alignment: {
                    horizontal: 'center'
                }
            }
        },
        A2: {
            t: 's',
            v: '单位：',
            s: cellStyle
        },
        B2: {
            t: 's',
            v: '',
            s: {
                font: {
                    name: '宋体',
                    sz: '10.5'
                },
                alignment: {
                    horizontal: 'left',
                    vertical: 'center'
                }
            }
        },
        A3: {
            t: 's',
            v: '姓名',
            s: cellStyle
        },
        B3: {
            t: 's',
            v: requestion.name || '',
            s: cellStyle
        },
        D3: {
            t: 's',
            v: '职务职称',
            s: cellStyle
        },
        E3: {
            t: 's',
            v: '岗位工资',
            s: cellStyle
        },
        F3: {
            t: 's',
            v: '事由',
            s: cellStyle
        },
        G3: {
            t: 's',
            v: '人数',
            s: cellStyle
        },
        H3: {
            t: 's',
            v: '起始日期',
            s: cellStyle
        },
        I3: {
            t: 's',
            v: formatDate(requestion.startTime),
            s: cellStyle
        },
        J3: {
            t: 's',
            v: '天数',
            s: cellStyle
        },
        K3: {
            t: 's',
            v: '补助发放',
            s: cellStyle
        },
        L3: {
            t: 's',
            v: '比例',
            s: cellStyle
        },
        D4: {
            t: 's',
            v: requestion.jobTitle || '',
            s: cellStyle
        },
        E4: {
            t: 's',
            v: requestion.wage || '',
            s: cellStyle
        },
        F4: {
            t: 's',
            v: '科研',
            s: cellStyle
        },
        G4: {
            t: 's',
            v: '1',
            s: cellStyle
        },
        H4: {
            t: 's',
            v: '结束日期',
            s: cellStyle
        },
        I4: {
            t: 's',
            v: formatDate(requestion.endTime),
            s: cellStyle
        },
        J4: {
            t: 's',
            v: '1',
            s: cellStyle
        },
        K4: {
            t: 's',
            v: '正常发放',
            s: cellStyle
        },
        L4: {
            t: 's',
            v: '100%',
            s: cellStyle
        },
        A5: {
            t: 's',
            v: '经由地点、起止日期',
            s: cellStyle
        },
        G5: {
            t: 's',
            v: '交通费',
            s: cellStyle
        },
        J5: {
            t: 's',
            v: '住宿费',
            s: cellStyle
        },
        K5: {
            t: 's',
            v: '其他',
            s: cellStyle
        },
        A6: {
            t: 's',
            v: '日期',
            s: cellStyle
        },
        B6: {
            t: 's',
            v: '时间',
            s: cellStyle
        },
        C6: {
            t: 's',
            v: '起点',
            s: cellStyle
        },
        D6: {
            t: 's',
            v: '日期',
            s: cellStyle
        },
        E6: {
            t: 's',
            v: '时间',
            s: cellStyle
        },
        F6: {
            t: 's',
            v: '止点',
            s: cellStyle
        },
        G6: {
            t: 's',
            v: '类别',
            s: cellStyle
        },
        H6: {
            t: 's',
            v: '席别',
            s: cellStyle
        },
        I6: {
            t: 's',
            v: '金额',
            s: cellStyle
        },
        K6: {
            t: 's',
            v: '项目',
            s: cellStyle
        },
        L6: {
            t: 's',
            v: '金额',
            s: cellStyle
        },
        K7: {
            t: 's',
            v: '行李费',
            s: cellStyle
        },
        K8: {
            t: 's',
            v: '民航车费',
            s: cellStyle
        },
        K9: {
            t: 's',
            v: '航空保险',
            s: cellStyle
        },
        K10: {
            t: 's',
            v: '邮电费',
            s: cellStyle
        },
        K11: {
            t: 's',
            v: '文具资料费',
            s: cellStyle
        },
        K12: {
            t: 's',
            v: '其他',
            s: cellStyle
        },
        ['A' + (7 + trL)]: {
            t: 's',
            v: '伙食补助费、室内交通费参考值',
            s: cellStyle
        },
        ['F' + (7 + trL)]: {
            t: 's',
            v: '180.00',
            s: cellStyle
        },
        ['G' + (7 + trL)]: {
            t: 's',
            v: '小计',
            s: cellStyle
        },
        ['I' + (7 + trL)]: {
            t: 's',
            v: transportAcount() || '0.00',
            s: cellStyle
        },
        ['J' + (7 + trL)]: {
            t: 's',
            v: hotelAcount() || '0.00',
            s: cellStyle
        },
        ['K' + (7 + trL)]: {
            t: 's',
            v: '小计',
            s: cellStyle
        },
        ['L' + (7 + trL)]: {
            t: 's',
            v: otherAcountMoney || '0.00',
            s: cellStyle
        },
        ['A' + (8 + trL)]: {
            t: 's',
            v: '人民币合计（大写）',
            s: cellStyle
        },
        ['D' + (8 + trL)]: {
            t: 's',
            v: nToC(allMoney) + '元',
            s: cellStyle
        },
        ['J' + (8 + trL)]: {
            t: 's',
            v: `￥${allMoney.toFixed(2) || '0.00'}`,
            s: cellStyle
        },
        ['F' + (10 + trL)]: {
            t: 's',
            v: '审核人：',
            s: cellStyle
        },
        ['G' + (10 + trL)]: {
            t: 's',
            v: '',
            s: {
                font: {
                    name: '宋体',
                    sz: '10.5'
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }
            }
        },
        ['J' + (10 + trL)]: {
            t: 's',
            v: '报销人：',
            s: cellStyle
        },
        ['K' + (10 + trL)]: {
            t: 's',
            v: '',
            s: {
                font: {
                    name: '宋体',
                    sz: '10.5'
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }
            }
        },
        '!merges': [
            {
                s: {
                    c: 0,
                    r: 0
                },
                e: {
                    c: 11,
                    r: 0
                }
            },
            {
                s: {
                    c: 1,
                    r: 1
                },
                e: {
                    c: 11,
                    r: 1
                }
            },
            {
                s: {
                    c: 0,
                    r: 2
                },
                e: {
                    c: 0,
                    r: 3
                }
            },
            {
                s: {
                    c: 1,
                    r: 2
                },
                e: {
                    c: 2,
                    r: 3
                }
            },
            {
                s: {
                    c: 0,
                    r: 4
                },
                e: {
                    c: 5,
                    r: 4
                }
            },
            {
                s: {
                    c: 6,
                    r: 4
                },
                e: {
                    c: 8,
                    r: 4
                }
            },
            {
                s: {
                    c: 9,
                    r: 4
                },
                e: {
                    c: 9,
                    r: 5
                }
            },
            {
                s: {
                    c: 10,
                    r: 4
                },
                e: {
                    c: 11,
                    r: 4
                }
            },
            {
                s: {
                    c: 0,
                    r: 6 + trL
                },
                e: {
                    c: 4,
                    r: 6 + trL
                }
            },
            {
                s: {
                    c: 6,
                    r: 6 + trL
                },
                e: {
                    c: 7,
                    r: 6 + trL
                }
            },
            {
                s: {
                    c: 0,
                    r: 7 + trL
                },
                e: {
                    c: 2,
                    r: 7 + trL
                }
            },
            {
                s: {
                    c: 3,
                    r: 7 + trL
                },
                e: {
                    c: 8,
                    r: 7 + trL
                }
            },
            {
                s: {
                    c: 9,
                    r: 7 + trL
                },
                e: {
                    c: 11,
                    r: 7 + trL
                }
            }
        ]
        // '!cols':{
        //     width: '9',
        //     hidden: '1',
        //     customWidth: '1',
        //     wpx: 54,
        //     wch: 8.17,
        //     MDW: 6
        // }
    }
    for (let i = 0; i < transportation.length; i ++) {
        let cellObj = {
            [`A${i + 7}`]: {
                t: 's',
                v: formatDate(transportation[i].startDate),
                s: cellStyle
            },
            [`B${i + 7}`]: {
                t: 's',
                v: formatTime(transportation[i].startTime),
                s: cellStyle
            },
            [`C${i + 7}`]: {
                t: 's',
                v: transportation[i].startAddress,
                s: cellStyle
            },
            [`D${i + 7}`]: {
                t: 's',
                v: formatDate(transportation[i].endDate),
                s: cellStyle
            },
            [`E${i + 7}`]: {
                t: 's',
                v: formatTime(transportation[i].endTime),
                s: cellStyle
            },
            [`F${i + 7}`]: {
                t: 's',
                v: transportation[i].endAddress,
                s: cellStyle
            },
            [`G${i + 7}`]: {
                t: 's',
                v: feeTypesEnum[transportation[i].type],
                s: cellStyle
            },
            [`H${i + 7}`]: {
                t: 's',
                v: setSeat(transportation[i].type, transportation[i].seat),
                s: {
                    font: {
                        name: '宋体',
                        sz: '10.5'
                    },
                    alignment: {
                        horizontal: 'center',
                        wrapText: true
                    },
                    border: {}
                }
            },
            [`I${i + 7}`]: {
                t: 's',
                v: transportation[i].money.toFixed(2),
                s: cellStyle
            }
        }
        Object.assign(st, cellObj)
    }
    for (let i = 0; i < hotel.length; i ++) {
        let cellObj2 = {
            [`J${i + 7}`]: {
                t: 's',
                v: hotel[i].money.toFixed(2),
                s: cellStyle
            }
        }
        Object.assign(st, cellObj2)
    }
    for (let i = 0; i < 6; i ++) {
        let cellObj3 = {
            [`L${i + 7}`]: {
                t: 's',
                v: otherAcountEnum[i] ? otherAcountEnum[i].toFixed(2) : '',
                s: cellStyle
            }
        }
        Object.assign(st, cellObj3)
    }
    for (let i = 3; i < 9 + trL; i ++) {
        for (let col of cols) {
            if (!st[`${col}${i}`]) {
                st[`${col}${i}`] = {
                    v: '',
                    s: {
                        border: {
                            top: {
                                style: 'thin',
                                color: '000000'
                            },
                            left: {
                                style: 'thin',
                                color: '000000'
                            },
                            bottom: {
                                style: 'thin',
                                color: '000000'
                            },
                            right: {
                                style: 'thin',
                                color: '000000'
                            }
                        }
                    }
                }
            }
        }
    }
    // 边框加粗
    for (let col of cols) {
        st[`${col}3`].s = {
            font: {
                name: '宋体',
                sz: '10.5'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            border: {
                top: {
                    style: 'medium',
                    color: '000000'
                },
                left: {
                    style: 'thin',
                    color: '000000'
                },
                right: {
                    style: 'thin',
                    color: '000000'
                },
                bottom: {
                    style: 'thin',
                    color: '000000'
                }
            }
        }
        st[`${col}4`].s = {
            font: {
                name: '宋体',
                sz: '10.5'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            border: {
                top: {
                    style: 'thin',
                    color: '000000'
                },
                left: {
                    style: 'thin',
                    color: '000000'
                },
                right: {
                    style: 'thin',
                    color: '000000'
                },
                bottom: {
                    style: 'medium',
                    color: '000000'
                }
            }
        }
        st[`${col}${8 + trL}`].s = {
            font: {
                name: '宋体',
                sz: '10.5'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            border: {
                top: {
                    style: 'medium',
                    color: '000000'
                },
                left: {
                    style: 'thin',
                    color: '000000'
                },
                right: {
                    style: 'thin',
                    color: '000000'
                },
                bottom: {
                    style: 'medium',
                    color: '000000'
                }
            }
        }
    }
    for (let i = 0; i < 6; i ++) {
        st[`${cols[i]}${7 + trL}`].s = {
            font: {
                name: '宋体',
                sz: '10.5'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            border: {
                top: {
                    style: 'medium',
                    color: '000000'
                },
                left: {
                    style: 'thin',
                    color: '000000'
                },
                right: {
                    style: 'thin',
                    color: '000000'
                },
                bottom: {
                    style: 'thin',
                    color: '000000'
                }
            }
        }
    }
    for (let i = 3; i < 9 + trL; i ++) {
        st['A' + i].s = {
            font: {
                name: '宋体',
                sz: '10.5'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            border: Object.assign({}, st['A' + i].s.border, {
                left: {
                    style: 'medium',
                    color: '000000'
                }
            })
        }
        st['L' + i].s = {
            font: {
                name: '宋体',
                sz: '10.5'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            border: Object.assign({}, st['L' + i].s.border, {
                right: {
                    style: 'medium',
                    color: '000000'
                }
            })
        }
    }
    for (let i = 5; i < 8 + trL; i ++) {
        st['G' + i].s = {
            font: {
                name: '宋体',
                sz: '10.5'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            border: Object.assign({}, st['G' + i].s.border, {
                left: {
                    style: 'medium',
                    color: '000000'
                }
            })
        }
        st['J' + i].s = {
            font: {
                name: '宋体',
                sz: '10.5'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            border: Object.assign({}, st['A' + i].s.border, {
                left: {
                    style: 'medium',
                    color: '000000'
                },
                right: {
                    style: 'medium',
                    color: '000000'
                }
            })
        }
    }
    for (let i = 3; i < 9; i ++) {
        st[`${cols[i]}1`] = {
            v: '',
            s: {
                border: {
                    bottom: {
                        style: 'medium',
                        color: '000000'
                    }
                }
            }
        }
    }
    // 修改几个无边框
    st['A2'].s = st[`F${10 + trL}`].s = st[`J${10 + trL}`].s = {
        font: {
            name: '宋体',
            sz: '10.5'
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        border: {}
    }
    // for (let col of cols) {
    //     st[`${col}3`].s.border.top.style = 'medium'
    //     st[`${col}4`].s.border.bottom.style = 'medium'
    //     st[`${col}19`].s.border.bottom.style = 'medium'
    //     st[`${col}19`].s.border.top.style = 'medium'
    // }

    let workbook = {
        SheetNames: ['sheet1'],
        Sheets: {
            'sheet1': st
        }
    }
    let filename = (Date.now() + requestion.id + Math.random()).toString(16)

    xlsx.writeFile(workbook, path.resolve(__dirname, `../static/financeExcel/${filename}.xlsx`))
    return `/static/financeExcel/${filename}.xlsx`
}
