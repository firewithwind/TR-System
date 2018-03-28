<template>
    <div class="reimwrapper">
        <div v-if="requestion.state>1">
            <p class="split">单据报销申请 <span v-if="requestion.state>=2&&requestion.state<4&&!isRemark" class="addReim" @click="showDialog1Visible">添加条目</span></p>
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
            <div v-if="requestion.state>=2&&requestion.state<=3&&!isRemark">
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
            width="50%">
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
        <el-dialog :visible.sync="dialogPicture">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
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
        reims: {
            type: Array,
            default: () => {
                return []
            }
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
            this.$emit('addNewReim', this.newReim)
            this.dialog1Visible = false
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
        },
        showDialog1Visible() {
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
            this.dialog1Visible = true
        },
        changeFeeType(value) {
            this.newReim.seat = ''
        }
    }
}
</script>
<style lang="stylus">
.reimwrapper
    .split
        font-size: .16rem
        color: #409EFF
        margin: .05rem 0 .2rem .05rem
        .addReim
            float: right
            margin-right: .1rem
            cursor: pointer
</style>
