<template>
    <div class="statusticbyyear">
        <div class="condition">
            <div class="type-wrapper">
                <el-radio v-model="type" :label="0">年度范围统计</el-radio>
                <el-radio v-model="type" :label="1">年内数据统计</el-radio>
            </div>
            <div class="picker-wrapper" v-if="type===0">
                <span class="label">选择年份范围</span>
                <el-date-picker
                    v-model="start"
                    type="year"
                    placeholder="起始年份"
                    value-format="timestamp">
                </el-date-picker>
                <span class="place-split">至</span>
                <el-date-picker
                    v-model="end"
                    type="year"
                    placeholder="终止年份"
                    value-format="timestamp">
                </el-date-picker>
                <el-button type="primary" class="submit" @click="getRangeYearData">查询</el-button>
            </div>
            <div class="picker-wrapper" v-else>
                <span class="label">选择年份</span>
                <el-date-picker
                    v-model="start"
                    type="year"
                    placeholder="请选择">
                </el-date-picker>
                <el-button type="primary" class="submit" @click="getYearData">查询</el-button>
            </div>
        </div>
        <div class="chart-wrapper">
            <div class="range-year" v-show="type===0">
                <p class="title" v-show="showChart">年度范围统计（单位：￥）</p>
                <div class="charts" ref="chart"></div>
                <statistic-infor :reims="year_reims" v-show="showChart"></statistic-infor>
                <p class="title" v-show="showChart">年度范围项目统计（单位：￥）</p>
                <div class="charts" ref="chart2"></div>
                <statistic-infor :reims="year_project_reims" v-show="showChart"></statistic-infor>
                <p class="title" v-show="showChart">年度范围类型统计（单位：￥）</p>
                <div class="pie-chart" ref="chart3"></div>
            </div>
            <div class="one-year" v-show="type===1">

            </div>
        </div>
    </div>
</template>
<script>
import {getYearAbs, setYearData, setProjectsChatsData, setTypeChartsData} from '@/utils/statisticsDataHandle'
import StatisticInfor from '@/components/StatisticInfor'

export default {
    components: {
        StatisticInfor
    },
    data() {
        return {
            type: 0,
            start: '',
            end: '',
            charts: [],
            reims: [],
            year_reims: [],
            year_project_reims: [],
            year_type_reims: [],
            showChart: false
        }
    },
    mounted() {
        this.charts[0] = this.$chart.init(this.$refs.chart, 'light')
        this.charts[1] = this.$chart.init(this.$refs.chart2, 'light')
        this.charts[2] = this.$chart.init(this.$refs.chart3, 'light')
        this.charts[0].on('click', this.selectYear)
        this.charts[1].on('click', this.selectProject)
        this.charts[2].on('click', this.selectType)
        window.onresize = () => {
            this.charts.forEach(chart => {
                chart.resize()
            })
        }
    },
    methods: {
        getRangeYearData() {
            if (!!this.start && !!this.end && this.start <= this.end) {
                this.charts[0].showLoading()
                this.$request
                    .post('/test/getRangeYearData')
                    .send({
                        start: this.start,
                        end: this.end
                    })
                    .end((err, res) => {
                        if (!!err) {
                            this.$message({
                                type: 'error',
                                message: err.response.text
                            })
                        } else {
                            this.showChart = true
                            this.reims = res.body
                            getYearAbs(this.start, this.end)
                                .then(years => {
                                    this.createYearOption(years, setYearData(res.body, years), 'line', this.charts[0], {})
                                })
                            let result = setProjectsChatsData(res.body)
                            let result2 = setTypeChartsData(res.body)
                            this.createYearOption(result.x, result.data, 'bar', this.charts[1], {})
                            this.createPieOption(result2, this.charts[2], {})
                        }
                    })
            } else {
                this.$message('请选择正确的时间段')
            }
        },
        getYearData() {

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
        createYearOption(xData, sData, type, chart, extend) {
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
        selectYear(params) {
            let filterParam = params.name
            let result = this.reims.filter((reim) => {
                if (new Date(+reim.startDate).getFullYear() === +filterParam) {
                    return true
                }
                return false
            })
            this.year_reims = result
        },
        selectProject(params) {
            let filterParam = params.name.split(':')[0]
            let result = this.reims.filter((reim) => {
                console.log(reim)
                if (reim.pid === +filterParam) {
                    return true
                }
                return false
            })
            this.year_project_reims = result
        },
        selectType(params) {
            let filterParam = params.name.split(':')
            let result = this.reims.filter((reim) => {
                if (reim.type === +filterParam[0]) {
                    return true
                }
                return false
            })
            this.year_type_reims = result
        }
    }
}
</script>
<style lang="stylus" scoped>
.statusticbyyear
    .condition
        font-size: .14rem
        text-align: left
        border-bottom: 1px solid #f2f6fc
        padding-bottom: .2rem
        .type-wrapper
            margin-top: -.1rem
            margin-bottom: .2rem
        .label
            margin-right: .1rem
        .place-split
            margin: 0 .05rem
        .submit
            margin-left: .1rem
            vertical-align: top
    .chart-wrapper
        margin-top: .1rem
        font-size: .14rem
        .charts
            width: 100%
            height: 3rem
            margin-top: -.4rem
        .pie-chart
            width: 100%
            height: 5rem
            margin-top: -1rem
</style>
