<template>
    <div class="create">
        <el-steps v-if="requestion.state!=0" class="state-wrapper" :active="requestion.state" align-center>
            <el-step v-for="step in steps" :key="step.title" :title="step.title" :description="step.desc"></el-step>
        </el-steps>
        <el-form class="requestion-wrapper" v-model="requestion" label-width="0.8rem" :inline="inline">
            <el-form-item label="申请人:">
                {{requestion.name}}
            </el-form-item>
            <el-form-item label="实验室:">
                {{requestion.laboratory}}
            </el-form-item>
            <el-form-item label="所属项目:">
                <el-select v-if="requestion.state===0" v-model="requestion.project" clearable>
                    <el-option
                      v-for="item in projects"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <span v-else>{{requestion.project}}</span>
            </el-form-item>
            <el-form-item v-if="requestion.state!=0" label="申请时间:">
                {{formatDate(requestion.occurTime)}}
            </el-form-item>
        </el-form>
        <p class="split">出差任务申请</p>
        <el-form class="trip-wrapper" v-model="requestion" label-width="0.8rem" :inline="inline">
            <el-form-item label="出差时间:">
                <el-date-picker
                    v-if="requestion.state===0"
                    v-model="requestion.dataRange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                <span v-else>{{formatDate(requestion.startTime)}} 至 {{formatDate(requestion.endTime)}}</span>
            </el-form-item>
            <el-form-item label="交通工具:">
                <el-select v-if="requestion.state===0" v-model="requestion.way">
                    <el-option
                        v-for="item in ways"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
                <span v-else>{{feeTypesEnum[requestion.way]}}</span>
            </el-form-item>
            <el-form-item label="目的地:">
                <el-input v-if="requestion.state===0" v-model="requestion.destination" placeholder="输入目的地"></el-input>
                <span v-else>{{requestion.destination}}</span>
            </el-form-item>
            <el-form-item label="出差事由:">
                <el-input v-if="requestion.state===0" v-model="requestion.description" placeholder="输入出差事由"></el-input>
                <span v-else>{{requestion.description}}</span>
            </el-form-item>
            <el-form-item v-if="requestion.state>=2" label="审批人:">
                <span v-for="item in requestion.approver" :key="item">{{item}}&nbsp;&nbsp;&nbsp;</span>
            </el-form-item>
        </el-form>
        <el-dialog
          :visible.sync="dialog2Visible"
          width="30%"
          :before-close="remarkClose">
            <template>
                <el-radio v-model="remarkResult" :label="0">通过</el-radio>
                <el-radio v-model="remarkResult" :label="1">驳回</el-radio>
            </template>
            <el-input
                v-if="!!remarkResult"
                type="textarea"
                autosize
                placeholder="请输入驳回原因"
                v-model="remarkReason">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog2Visible = false">取 消</el-button>
                <el-button type="primary" @click="remark">确 定</el-button>
            </span>
        </el-dialog>
        <div v-if="showButton">
            <el-button v-if="requestion.state>0&&requestion.state<=2&&!isRemark" type="primary" class="submit" @click="submit(0)">撤销</el-button>
            <el-button v-if="requestion.state<1&&!isRemark" type="primary" class="submit" @click="submit(1)">提交申请</el-button>
            <el-button v-if="(requestion.state>=1&&requestion.state<2)&&isRemark" type="primary" class="submit" @click="dialog2Visible=true">审批</el-button>
        </div>
    </div>
</template>
<script>
import {formatTime, formatDate} from '@/utils'
import {ways, feeTypes, steps, feeTypesEnum, seat} from '@/dataMap'
export default {
    props: {
        requestion: {
            type: Object,
            required: true
        },
        isRemark: {
            type: Boolean,
            default: false
        },
        inline: {
            type: Boolean,
            default: false
        },
        showButton: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            ways,
            feeTypes,
            steps,
            feeTypesEnum,
            seat,
            projects: [
                {
                    label: '重点项目',
                    value: 1
                }
            ],
            newReim: {
                type: 30,
                startAddress: '',
                startDate: '',
                startTime: '',
                endAddress: '',
                endDate: '',
                endTime: '',
                seat: '',
                desc: '',
                money: ''
            },
            remarkResult: 0,
            remarkReason: '',
            dialog1Visible: false,
            dialog2Visible: false
        }
    },
    methods: {
        formatTime,
        formatDate,
        remarkClose() {
            this.dialog2Visible = false
        },
        submit(ope) {
            this.$emit('operateRequestion', undefined, ope)
        },
        remark() {
            this.$emit('remarkRequestion', this.remarkResult, this.remarkReason)
            this.dialog2Visible = false
        }
    }
}
</script>
<style lang="stylus" scoped>
.create
    text-align: left
    .split
        font-size: .16rem
        color: #409EFF
        margin: .05rem 0 .2rem .05rem
    .el-form-item
        min-width: 30%
    .state-wrapper
        margin-top: .3rem
        margin-bottom: .5rem
    .requestion-wrapper
        border-bottom: 1px solid #F2F6FC
    .trip-wrapper
        border-bottom: 1px solid #F2F6FC
    .submit
        margin-top: .3rem
</style>
