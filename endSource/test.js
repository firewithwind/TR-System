// const {createFinanceReim} = require('./utils/index.js')

// var a = [{
//     desc: 's',
//     endAddress: 'beijing',
//     endDate: '1526486400000',
//     endTime: '1525335821000',
//     money: 22,
//     seat: 1,
//     startAddress: 'weihai',
//     startDate: '1526486400000',
//     startTime: '1525335809000',
//     type: 30
// }]

// createFinanceReim(a, undefined, {
//     name: '刘连兴'
// })

var a = {
    font: {
        name: '微软雅黑',
        sz: '11'
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

console.log(Object.assign(a, a.border, {
    top: {
        style: 'medium',
        color: '000000'
    }
}))
