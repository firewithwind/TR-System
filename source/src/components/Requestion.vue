<template>
    <div class="create">
        <el-steps v-if="requestion.state!=0" class="state-wrapper" :active="requestion.state" align-center>
            <el-step v-for="step in steps" :key="step.title" :title="step.title" :description="step.desc"></el-step>
        </el-steps>
        <el-form class="requestion-wrapper" v-model="requestion" label-width="0.8rem" :inline="inline">
            <el-form-item label="申请人:">
                {{requestion.name}}
            </el-form-item>
            <el-form-item label="研究室:">
                {{requestion.laboratory}}
            </el-form-item>
            <el-form-item label="所属项目:">
                <el-select v-if="requestion.state===0" v-model="requestion.project" clearable>
                    <el-option
                      v-for="item in projects"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                </el-select>
                <span v-else>{{requestion.project}}</span>
            </el-form-item>
            <el-form-item v-if="requestion.state!=0" label="申请时间:">
                {{formatDate(requestion.occurTime)}}
            </el-form-item>
        </el-form>
        <p class="split">出差任务申请
            <svg v-if="requestion.state>=2" class="icon" aria-hidden="true" @click="exportTrip">
                <use xlink:href="#icon-print"></use>
            </svg>
        </p>
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
                <span v-for="item in requestion.approver" :key="item">{{item}}</span>
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
        <div id="printTripInfo" style="width:100%;font-size:14px;text-align:center;">
            <span style="font-weight: bold">网络与信息安全技术研究中心出差任务审批单</span>
            <table style="width:80%;margin:15px auto 0;" cellspacing="0">
                <tr>
                    <td class="label">申请人</td>
                    <td class="value">{{requestion.name}}</td>
                    <td class="label">出差时间</td>
                    <td class="value">{{formatDate(requestion.startTime)}}-{{formatDate(requestion.endTime)}}</td>
                </tr>
                <tr>
                    <td class="label">计入项目</td>
                    <td class="value">{{requestion.project}}</td>
                    <td class="label">交通工具</td>
                    <td class="value">{{feeTypesEnum[requestion.way]}}</td>
                </tr>
                <tr>
                    <td class="label">目的地</td>
                    <th colspan="3" class="value">{{requestion.destination}}</th>
                </tr>
                <tr class="desc">
                    <td class="label">出差事由</td>
                    <th colspan="3" class="value">{{requestion.destination}}</th>
                </tr>
                <tr>
                    <td class="label">课题组长审批意见</td>
                    <th colspan="3" class="value">{{requestion.destination}}</th>
                </tr>
                <tr>
                    <td class="label">中心领导审批意见</td>
                    <th colspan="3" class="value">{{requestion.destination}}</th>
                </tr>
            </table>
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
        },
        projects: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            ways,
            feeTypes,
            steps,
            feeTypesEnum,
            seat,
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
        exportTrip() {
            let style = `
            <style>
            table {
                font-size: 14px;
                border:solid #000000;
                border-width:1px 0px 0px 1px;
            }
            td{
                border:solid #000000;
                border-width:0px 1px 1px 0px;
            }
            th {
                border:solid #000000;
                border-width:0px 1px 1px 0px;
            }
            .label {
                width: 70px;
                text-align: center;
            }
            .value {
                text-indent: 2px;
                text-align: left;
                font-weight: 400;
            }
            .desc {
                height: 100px;
            }
            </style>`
            let newWindow = window.open('_blank')
            let codestr = document.getElementById('printTripInfo').outerHTML
            newWindow.document.write(style)
            newWindow.document.write(codestr)
            newWindow.document.close()
            newWindow.print()
            newWindow.close()
        },
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
        .icon
            cursor: pointer
            width: .2rem
            height: .2rem
            vertical-align: middle
            margin-left: .05rem
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
    #printTripInfo
        display: none
</style>
