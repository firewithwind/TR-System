<template>
    <div class="create">
        <el-steps v-if="requestion.state!=-0" class="state-wrapper" :active="requestion.state" align-center>
            <el-step v-for="step in steps" :key="step.title" :title="step.title" :description="step.desc"></el-step>
        </el-steps>
        <el-form class="requestion-wrapper" v-model="requestion" label-width="0.8rem" :inline="inline">
            <el-form-item label="申请人:">
                {{requestion.user}}
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
        </el-form>
        <p class="split">出差任务申请</p>
        <el-form class="trip-wrapper" v-model="trip" label-width="0.8rem" :inline="inline">
            <el-form-item label="出差时间:">
                <el-date-picker
                    v-if="requestion.state===0"
                    v-model="trip.dataRange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                <span v-else>{{formatDate(trip.startTime)}} 至 {{formatDate(trip.endTime)}}</span>
            </el-form-item>
            <el-form-item label="交通工具:">
                <el-select v-if="requestion.state===0" v-model="trip.way">
                    <el-option
                        v-for="item in ways"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
                <span v-else>{{feeTypesEnum[trip.way]}}</span>
            </el-form-item>
            <el-form-item label="目的地:">
                <el-input v-if="requestion.state===0" v-model="trip.destination" placeholder="输入目的地"></el-input>
                <span v-else>{{trip.destination}}</span>
            </el-form-item>
            <el-form-item label="出差事由:">
                <el-input v-if="requestion.state===0" v-model="trip.description" placeholder="输入出差事由"></el-input>
                <span v-else>{{trip.description}}</span>
            </el-form-item>
            <el-form-item v-if="requestion.state>=2" label="审批人:">
                <span v-for="item in trip.approver" :key="item">{{item}}&nbsp;&nbsp;&nbsp;</span>
            </el-form-item>
        </el-form>
        <div v-if="requestion.state>=2">
            <p class="split">单据报销申请 <span v-if="requestion.state===2&&!isRemark" class="addReim" @click="dialog1Visible = true">添加条目</span></p>
            <el-table
                class="reimbursement-wrapper"
                :data="reims"
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    label="费用类型">
                    <template slot-scope="scope">
                        {{feeTypesEnum[scope.row.type]}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="开始日期">
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
                    label="结束日期">
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
                    prop="seat"
                    label="席别">
                </el-table-column>
                <el-table-column
                    prop="desc"
                    label="费用描述"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="金额">
                </el-table-column>
            </el-table>
            <div v-if="requestion.state===2&&!isRemark">
                <p class="split">上传发票</p>
                <el-upload
                    :http-request="uploadInvoice"
                    action=""
                    list-type="picture-card"
                    accept="image/*, *.pdf"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
        </div>
        <el-dialog
            title="新增报销事项"
            :visible.sync="dialog1Visible"
            width="50%"
            :before-close="handleClose">
            <el-form v-model="newReim" label-width="0.8rem">
                <el-form-item label="费用类型">
                    <el-select v-model="newReim.type" @change="changeFeeType">
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
                <el-form-item label="起点">
                    <el-input v-model="newReim.startAddress" placeholder="输入起点"></el-input>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker v-model="newReim.startDate" placeholder="输入开始日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-time-picker v-model="newReim.startTime" placeholder="输入开始时间"></el-time-picker>
                </el-form-item>
                <el-form-item label="终点">
                    <el-input v-model="newReim.endAddress" placeholder="输入终点"></el-input>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker v-model="newReim.endDate" placeholder="输入结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-time-picker v-model="newReim.endTime" placeholder="输入结束时间"></el-time-picker>
                </el-form-item>
                <el-form-item label="席别" v-if="newReim.type>=30&&newReim.type<=32">
                    <el-select v-model="newReim.seat">
                        <el-option
                            v-for="item in seat[newReim.type]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="newReim.desc" placeholder="输入费用描述"></el-input>
                </el-form-item>
                <el-form-item label="金额">
                    <el-input v-model="newReim.money" placeholder="输入费用金额">
                        <span slot="prepend">￥</span>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog1Visible = false">取 消</el-button>
                <el-button type="primary" @click="addNewReim">确 定</el-button>
            </span>
        </el-dialog>
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
        <el-dialog :visible.sync="dialogPicture">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button v-if="!isRemark" type="primary" class="submit" @click="submit">提交申请</el-button>
        <el-button v-if="isRemark" type="primary" class="submit" @click="dialog2Visible=true">审批</el-button>
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
        trip: {
            type: Object,
            default: function() {
                return {
                    dataRange: [],
                    way: 30,
                    destination: '',
                    description: '',
                    approver: []
                }
            }
        },
        isRemark: {
            type: Boolean,
            default: false
        },
        inline: {
            type: Boolean,
            default: false
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
            reims: [],
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
            dialog2Visible: false,
            dialogImageUrl: '',
            dialogPicture: false
        }
    },
    methods: {
        formatTime,
        formatDate,
        addNewReim() {
            console.log(this.newReim)
            this.reims.push(this.newReim)
            this.newReim = {
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
            }
            this.dialog1Visible = false
        },
        handleClose() {
            this.newReim = {
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
            }
            this.dialog1Visible = false
        },
        remarkClose() {
            this.dialog2Visible = false
        },
        changeFeeType(value) {
            this.newReim.seat = ''
        },
        submit() {
            console.log(this.requestion)
        },
        remark() {
            console.log(this.requestion.id, this.remarkResult, this.remarkReason)
            this.dialog2Visible = false
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogPicture = true
        },
        uploadInvoice(arg) {
            // console.log(arg)
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
        .addReim
            float: right
            margin-right: .1rem
            cursor: pointer
    .el-form-item
        min-width: 30%
    .state-wrapper
        margin-top: .3rem
        margin-bottom: .5rem
    .requestion-wrapper
        border-bottom: 1px solid #F2F6FC
    .trip-wrapper
        border-bottom: 1px solid #F2F6FC
    .reimbursement-wrapper
        margin-bottom: 0rem
    .submit
        margin-top: .3rem
</style>
