<template>
    <div class="statistic-infor">
        <el-table
            class="reimbursement-wrapper"
            :data="reims"
            style="width: 100%">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                label="申请人"
                prop="name">
            </el-table-column>
            <el-table-column
                label="费用类型">
                <template slot-scope="scope">
                    {{feeTypesEnum[scope.row.type]}}
                </template>
            </el-table-column>
            <el-table-column
                label="开始日期"
                width="95">
                <template slot-scope="scope">
                    {{formatDate(scope.row.startDate)}}
                </template>
            </el-table-column>
            <el-table-column
                label="开始时间">
                <template slot-scope="scope">
                    {{formatTime(scope.row.startTime)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="startAddress"
                label="起点">
            </el-table-column>
            <el-table-column
                label="结束日期"
                width="95">
                <template slot-scope="scope">
                    {{formatDate(scope.row.endDate)}}
                </template>
            </el-table-column>
            <el-table-column
                label="结束时间">
                <template slot-scope="scope">
                    {{formatTime(scope.row.endTime)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="endAddress"
                label="止点">
            </el-table-column>
            <el-table-column
                label="席别">
                <template slot-scope="scope">
                    {{setSeat(scope.row.type, scope.row.seat)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="desc"
                label="费用描述">
            </el-table-column>
            <el-table-column
                prop="money"
                label="金额">
            </el-table-column>
            <el-table-column
                prop="note"
                label="备注">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {formatDate, formatTime} from '@/utils'
import {feeTypesEnum, seat} from '@/dataMap'

export default {
    props: {
        reims: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            feeTypesEnum
        }
    },
    methods: {
        formatDate,
        formatTime,
        setSeat(type, s) {
            if (!!s) {
                return seat[type][s].label
            }
            return ''
        }
    }
}
</script>
<style lang="stylus">
.statistic-infor
    margin-top: .3rem
    text-align: left
</style>
