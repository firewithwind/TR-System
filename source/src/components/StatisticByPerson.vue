<template>
    <div class="statisticbyperson">
        <div class="condition">
            <el-form :model="param" label-width=".8rem" :inline="true">
                <el-form-item label="用户">
                    <el-input v-model="param.id" placeholder="请输入用户ID" clearable></el-input>
                </el-form-item>
                <el-form-item label="选择日期">
                    <el-date-picker
                        v-model="param.dateRange"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                <el-button class="submit" type="primary" @click="getPersonData(chartByMonth)">查询</el-button>
                <p class="split">提示：将默认对当前用户数据进行统计</p>
            </el-form>
        </div>
        <div class="content">
            <p class="title">个人按月报销统计（单位：￥）</p>
            <div class="charts" ref="chart"></div>
            <statistic-infor :reims="person_month_reims"></statistic-infor>
            <p class="title">个人项目报销统计（单位：￥）</p>
            <div class="charts" ref="chart2"></div>
            <statistic-infor :reims="person_project_reims"></statistic-infor>
            <p class="title">个人消费类型报销统计（单位：￥）</p>
            <div class="pie-chart" ref="chart3"></div>
            <statistic-infor class="last-infor" :reims="person_type_reims"></statistic-infor>
        </div>
    </div>
</template>
<script>
import {formatDate, formatTime} from '@/utils'
import {getMonthAbs, setPersonMonthsChartsData, setProjectsChatsData, setTypeChartsData} from '@/utils/statisticsDataHandle'
import StatisticInfor from '@/components/StatisticInfor'

export default {
    components: {
        StatisticInfor
    },
    data() {
        return {
            param: {
                id: '',
                dateRange: []
            },
            projects: [],
            reims: [],
            person_month_reims: [],
            person_project_reims: [],
            person_type_reims: [],
            chartByMonth: [],
            pickerOptions: {
                disabledDate: (date) => {
                    let dateSpace = date.getTime() > Date.now()
                    return dateSpace
                }
            }
        }
    },
    mounted() {
        this.chartByMonth[0] = this.$chart.init(this.$refs.chart, 'light')
        this.chartByMonth[1] = this.$chart.init(this.$refs.chart2, 'light')
        this.chartByMonth[2] = this.$chart.init(this.$refs.chart3, 'light')
        this.getPersonData(this.chartByMonth)
        this.chartByMonth[0].on('click', this.selectMonth)
        this.chartByMonth[1].on('click', this.selectProject)
        this.chartByMonth[2].on('click', this.selectType)
        window.onresize = () => {
            this.chartByMonth.forEach(chart => {
                chart.resize()
            })
        }
    },
    methods: {
        formatDate,
        formatTime,
        getPersonData(charts) {
            let body = {}
            body.id = this.param.id || this.$store.state.user.id || localStorage.user
            if (!this.param.dateRange || this.param.dateRange.length === 0) {
                body.endDate = new Date().setHours(0, 0, 0, 0)
                body.startDate = new Date(body.endDate).setMonth(new Date(body.endDate).getMonth() - 9)
            } else {
                body.startDate = this.param.dateRange[0].getTime()
                body.endDate = this.param.dateRange[1].getTime()
            }
            charts.forEach(chart => {
                chart.showLoading()
            })
            this.$request
                .post('/test/getPersonData')
                .send({
                    ...body
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$error(err.response.text)
                    } else {
                        if (res.body && res.body.length === 0) {
                            this.$message({
                                type: 'warning',
                                message: '没有数据哦~'
                            })
                        }
                        this.reims = res.body
                        getMonthAbs(body.startDate, body.endDate)
                        .then((res) => {
                            this.createPersonOption(res, setPersonMonthsChartsData(this.reims, res), 'line', charts[0], {})
                        })
                        let result1 = setProjectsChatsData(res.body)
                        let result2 = setTypeChartsData(res.body)
                        this.createPersonOption(result1.x, result1.data, 'bar', charts[1], {})
                        this.createPersonPieOption(result2, charts[2])
                    }
                })
        },
        createPersonOption(xData, sData, type, chart, extend) {
            let option = {
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: xData
                },
                dataZoom: [
                    {
                        xAxisIndex: 0
                    }
                ],
                yAxis: {},
                series: [{
                    name: '消费',
                    type: type,
                    data: sData
                }]
            }
            option = Object.assign({}, option, extend)
            chart.hideLoading()
            chart.setOption(option)
        },
        createPersonPieOption(data, chart, extend) {
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    top: 'middle',
                    // left: 'right',
                    right: '20%',
                    data: data.x
                },
                series: [
                    {
                        name: '消费类型',
                        type: 'pie',
                        radius: '55%',
                        center: ['38%', '50%'],
                        data: data.result.sort(function (a, b) { return a.value - b.value }),
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(0, 0, 0, 0.5)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200
                        }
                    }
                ]
            }
            chart.hideLoading()
            chart.setOption(option)
        },
        selectMonth(params) {
            let filterParam = params.name.split('-')
            let result = this.reims.filter((reim) => {
                let date = formatDate(reim.startDate).split('/')
                if (date[0] === filterParam[0] && date[1] === filterParam[1]) {
                    return true
                }
                return false
            })
            this.person_month_reims = result
        },
        selectProject(params) {
            let filterParam = params.name.split(':')
            let result = this.reims.filter((reim) => {
                if (reim.pid === +filterParam[0]) {
                    return true
                }
                return false
            })
            this.person_project_reims = result
        },
        selectType(params) {
            let filterParam = params.name.split(':')
            let result = this.reims.filter((reim) => {
                if (reim.type === +filterParam[0]) {
                    return true
                }
                return false
            })
            this.person_type_reims = result
        }
    }
}
</script>
<style lang="stylus" scoped>
.statisticbyperson
    .condition
        text-align: left
        .el-form
            width: 100%
            border-bottom: 1px solid #f2f6fc
            .el-form-item
                min-width: 30%
            .split
                font-size: .12rem
                text-indent: .1rem
                color: #e6a23c
                margin-top: 0
            .submit
                margin-left: .1rem
    .content
        .title
            font-size: .14rem
            margin-top: .5rem
        .charts
            width: 100%
            height: 3rem
            margin-top: -.4rem
        .pie-chart
            width: 100%
            height: 5rem
            margin-top: -1rem
        .last-infor
            margin-top: -.5rem
</style>
