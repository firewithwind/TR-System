<template>
    <div class="statistic">
        <el-container>
            <el-aside>
                <div class="condition">
                    <statistic-param @setData="setData"></statistic-param>
                </div>
            </el-aside>
            <el-main>
                <div class="content">
                    <p class="split">提示：将默认对当前用户数据进行统计<span v-if="$store.state.user.level>=1">，搜索全部成员请输入all</span></p>
                    <p class="title">时间报销统计（单位：￥）</p>
                    <div class="charts" ref="chart"></div>
                    <statistic-infor :reims="person_month_reims"></statistic-infor>
                    <p class="title">项目报销统计（单位：￥）</p>
                    <div class="charts" ref="chart2"></div>
                    <statistic-infor :reims="person_project_reims"></statistic-infor>
                    <p class="title">消费类型报销统计（单位：￥）</p>
                    <div class="pie-chart" ref="chart3"></div>
                    <statistic-infor class="last-infor" :reims="person_type_reims"></statistic-infor>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import {formatDate, formatTime} from '@/utils'
import {getMonthAbs, setPersonMonthsChartsData, setProjectsChatsData, setTypeChartsData, getYearAbs, setYearData} from '@/utils/statisticsDataHandle'
import StatisticInfor from '@/components/StatisticInfor'
import StatisticParam from '@/components/StatisticParam'

export default {
    components: {
        StatisticInfor,
        StatisticParam
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
            chart: [],
            pickerOptions: {
                disabledDate: (date) => {
                    let dateSpace = date.getTime() > Date.now()
                    return dateSpace
                }
            }
        }
    },
    mounted() {
        this.chart[0] = this.$chart.init(this.$refs.chart, 'light')
        this.chart[1] = this.$chart.init(this.$refs.chart2, 'light')
        this.chart[2] = this.$chart.init(this.$refs.chart3, 'light')
        this.chart[0].on('click', this.selectDate)
        this.chart[1].on('click', this.selectProject)
        this.chart[2].on('click', this.selectType)
        window.onresize = () => {
            this.chart.forEach(chart => {
                chart.resize()
            })
        }
    },
    methods: {
        formatDate,
        formatTime,
        setData(data, body) {
            let charts = this.chart
            if (data && data.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '没有数据哦~'
                })
            }
            this.reims = data
            if (body.type === 0) {
                getYearAbs(body.start, body.end)
                    .then(years => {
                        let dataRes = setYearData(data, years)
                        console.log(dataRes)
                        this.createPersonOption(years, dataRes.result, 'line', charts[0], {}, dataRes.allResult)
                    })
            } else {
                getMonthAbs(body.start, body.end)
                    .then((res) => {
                        let dataRes = setPersonMonthsChartsData(data, res)
                        this.createPersonOption(res, dataRes.result, 'line', charts[0], {}, dataRes.allResult)
                    })
            }
            let result1 = setProjectsChatsData(data)
            let result2 = setTypeChartsData(data)
            this.createPersonOption(result1.x, result1.data, 'bar', charts[1], {}, result1.allData)
            this.createPieOption(result2, charts[2])
        },
        createPersonOption(xData, sData, type, chart, extend, eData) {
            let option = {
                tooltip: {},
                legend: {
                    right: 0,
                    data: ['消费', '预支总消费']
                },
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
            if (eData) {
                option.series.unshift({
                    name: '预支总消费',
                    type: type,
                    data: eData
                })
            }
            option = Object.assign({}, option, extend)
            chart.hideLoading()
            chart.setOption(option)
        },
        createPieOption(data, chart, extend) {
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
        selectDate(params) {
            let filterParam = params.name.split('-')
            let result
            if (params.seriesIndex === 0) {
                result = this.reims.filter((reim) => {
                    let date = formatDate(reim.startDate || reim.reqStart).split('/')
                    if (filterParam.length === 2) {
                        if (date[0] === filterParam[0] && date[1] === filterParam[1]) {
                            return true
                        }
                    } else if (date[0] === filterParam[0]) {
                        return true
                    }
                    return false
                })
            } else if (params.seriesIndex === 1) {
                result = this.reims.filter((reim) => {
                    if (reim.state < 4) {
                        return false
                    }
                    let date = formatDate(reim.startDate || reim.reqStart).split('/')
                    if (filterParam.length === 2) {
                        if (date[0] === filterParam[0] && date[1] === filterParam[1]) {
                            return true
                        }
                    } else if (date[0] === filterParam[0]) {
                        return true
                    }
                    return false
                })
            }
            this.person_month_reims = result
        },
        selectProject(params) {
            let filterParam = params.name.split(':')
            let result
            if (params.seriesIndex === 0) {
                result = this.reims.filter((reim) => {
                    if (reim.pid === +filterParam[0]) {
                        return true
                    }
                    return false
                })
            } else {
                result = this.reims.filter((reim) => {
                    if (reim.state < 4) return false
                    if (reim.pid === +filterParam[0]) {
                        return true
                    }
                    return false
                })
            }
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
.statistic
    .el-aside
        position: fixed
        top: .61rem
        padding-top: .2rem
        border-right: 1px solid #f2f6fc
        .condition
            text-align: left
    .el-main
        margin-left: 3rem
    .content
        .split
            text-align: left
            font-size: .12rem
            text-indent: .1rem
            color: #e6a23c
            margin-top: 0
            border-bottom: 1px solid #f2f6fc
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
