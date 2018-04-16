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
                        end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="消费方式">
                    <el-select v-model="param.way" clearable>
                        <el-option-group
                            v-for="group in feeTypes"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                                v-for="item in group.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择项目">
                    <el-select v-model="param.project">
                        <el-option
                            v-for="pro in projects"
                            :key="pro.id"
                            :value="pro.id"
                            :label="pro.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button class="submit" type="primary">查询</el-button>
                <p class="split">提示：将默认对当前用户数据进行统计</p>
            </el-form>
        </div>
        <div class="content">
            <div class="charts" ref="chart"></div>
        </div>
    </div>
</template>
<script>
import {feeTypes} from '@/dataMap'
import {getMonthAbs, setChartsDate} from '@/utils'
export default {
    data() {
        return {
            feeTypes,
            param: {
                id: '',
                dateRange: [],
                way: '',
                project: ''
            },
            projects: [],
            reims: [],
            chartByMonth: null
        }
    },
    mounted() {
        let option = {
            title: {
                    text: '个人按月统计图'
                },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {},
                series: [{
                    name: '消费',
                    type: 'line',
                    data: []
                }]
        }
        this.chartByMonth = this.$chart.init(this.$refs.chart, 'light')
        this.chartByMonth.setOption(option)
        this.getPersonData(this.chartByMonth)
    },
    methods: {
        getPersonData(chart) {
            let body = {}
            body.id = this.param.id || this.$store.state.user.id
            if (this.param.dateRange.length === 0) {
                body.endDate = new Date().setHours(0, 0, 0, 0)
                body.startDate = new Date(body.endDate).setMonth(new Date(body.endDate).getMonth() - 9)
            } else {
                body.startDate = this.param.dateRange[0].getTime()
                body.endDate = this.param.dateRange[1].getTime()
            }
            body.way = this.param.way
            body.project = this.param.project
            this.$request
                .post('/test/getPersonData')
                .send({
                    ...body
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.reims = res.body
                        getMonthAbs(body.startDate, body.endDate)
                            .then((res) => {
                                let option = {
                                    title: {
                                            text: '个人按月统计图'
                                        },
                                        tooltip: {},
                                        xAxis: {
                                            type: 'category',
                                            data: res
                                        },
                                        yAxis: {},
                                        series: [{
                                            name: '消费',
                                            type: 'line',
                                            data: setChartsDate(this.reims, res)
                                        }]
                                }
                                this.chartByMonth.setOption(option)
                            })
                    }
                })
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
        .charts
            height: 3rem
</style>
