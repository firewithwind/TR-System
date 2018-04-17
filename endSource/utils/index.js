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
            v: '网络与信息安全技术研究中心（NIST）差旅费用报销单 单号',
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
        // '!rows':[
        //     { hpt: 28, hpx: 28 },
        //     { hpt: 45, hpx: 45 },
        //     { hpt: 60, hpx: 60 },
        //     { hpt: 33, hpx: 33 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 },
        //     { hpt: 30.5, hpx: 30.5 }
        // ],
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
                    style: 'medium',
                    color: '000000'
                }
                st[`${col}${i}`].s.border.bottom = {
                    style: 'medium',
                    color: '000000'
                }
            } else {
                st[`${col}${i}`] = {
                    v: '',
                    s: {
                        border: {
                            top: {
                                style: 'medium',
                                color: '000000'
                            },
                            bottom: {
                                style: 'medium',
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
    let filename = (Date.now() + requestion.id + Math.random()).toString(16)

    xlsx.writeFile(workbook, path.resolve(__dirname, `../static/reimExcel/${filename}.xlsx`))
    return `/static/reimExcel/${filename}.xlsx`
}

