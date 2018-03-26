export const ways = [
    {
        label: '火车',
        value: 30
    },
    {
        label: '轮船',
        value: 31
    },
    {
        label: '飞机',
        value: 32
    },
    {
        label: '汽车',
        value: 33
    },
    {
        label: '其它',
        value: 34
    }
]
export const feeTypes = [
    {
        label: '交通费',
        options: ways
    },
    {
        label: '住宿费',
        options: [
            {
                label: '住宿费',
                value: 10
            }
        ]
    },
    {
        label: '其它费用',
        options: [
            {
                label: '行李费',
                value: 20
            },
            {
                label: '民航车费',
                value: 21
            },
            {
                label: '航空保险',
                value: 22
            },
            {
                label: '邮电费',
                value: 23
            },
            {
                label: '文具资料费',
                value: 24
            },
            {
                label: '其它非交通费用',
                value: 25
            }
        ]
    }
]
export const feeTypesEnum = {
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
export const steps = [
    {
        state: 1,
        title: '任务待审批',
        desc: '任务审批完成后，您可以正常出差'
    },
    {
        state: 2,
        title: '任务审批通过',
        desc: ''
    },
    {
        state: 3,
        title: '报销待审批',
        desc: '您的报销申请已提交，请耐心等待'
    },
    {
        state: 4,
        title: '报销审批通过',
        desc: '您的报销申请已通过，请在规定时间内打印粘贴联并上交发票'
    },
    {
        state: 5,
        title: '已完成',
        desc: '财务人员已经收票'
    }
]
export const stateEnum = {
    1: '任务待审批',
    2: '任务审批通过',
    3: '报销待审批',
    4: '报销审批通过',
    5: '已完成'
}
export const seat = {
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
