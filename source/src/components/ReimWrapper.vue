<template>
    <div class="reimwrapper">
        <div v-if="requestion.state>2 || (requestion.state>1 && isCreatable)">
            <p class="split">单据报销申请
                <svg v-if="requestion.state>=4" class="icon" aria-hidden="true" @click="exportReim">
                    <use xlink:href="#icon-print"></use>
                </svg>
                <span v-if="requestion.state >= 4" class="exportFinanceReim" @click="exportCopy">下载发票粘贴联</span>
                <span v-if="requestion.state >= 4" class="exportFinanceReim" @click="exportFinanceReim">下载财务审批报销单</span>
                <span v-if="requestion.state>=2&&requestion.state<4&&!isRemark&&isSelf" class="addReim" @click="showDialog1Visible">添加条目</span>
            </p>
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
                    label="金额">
                    <template slot-scope="scope">
                        {{(+scope.row.money).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="note"
                    label="备注">
                </el-table-column>
                <el-table-column
                    v-if="requestion.state>=4"
                    prop="title"
                    label="报销来源（项目）">
                </el-table-column>
                <el-table-column
                    v-if="requestion.state>=2&&requestion.state<4&&!isRemark"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" style="color: rgb(255, 208, 75)" @click="deleteReim(scope.row, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <p class="acount-money">共{{acountMoney}}元</p>
            <div class="invoice-wrapper">
                <p class="split">上传发票</p>
                <li v-for="(pic, $index) in pics" :key="pic.id" class="picture-content">
                    <img :src="pic.url" alt="" class="el-upload-list__item-thumbnail">
                    <span class="picture-operate">
                        <span class="icon picture-preview" @click="handlePictureCardPreview(pic)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="requestion.state>=2&&requestion.state<=3&&!isRemark&&isSelf" class="icon picture-delete" @click="handleRemove(pic, undefined, $index)">
                            <i class="el-icon-delete"></i>
                        </span>
                    </span>
                </li>
                <el-upload
                    v-show="requestion.state>=2&&requestion.state<=3&&!isRemark&&isSelf"
                    :action="'/test/uploadInvoice?requestion=' + requestion.id"
                    list-type="picture-card"
                    :headers="uploadHeaders"
                    accept="image/*"
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
                <el-form-item v-if="newReim.type>=30&&newReim.type<=39" label="起点">
                    <el-input v-model="newReim.startAddress" placeholder="输入起点"></el-input>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker v-model="newReim.startDate" placeholder="输入开始日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-time-picker v-model="newReim.startTime" placeholder="输入开始时间"></el-time-picker>
                </el-form-item>
                <el-form-item v-if="newReim.type>=30&&newReim.type<=39" label="终点">
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
                <el-form-item label="备注">
                    <el-input v-model="newReim.note" placeholder="输入备注信息"></el-input>
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
import {formatTime, formatDate, resolveFloat} from '@/utils'
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
        pics: {
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
        },
        isCreatable: {
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
                money: '',
                note: ''
            },
            remarkResult: 0,
            remarkReason: '',
            dialog1Visible: false,
            dialogImageUrl: '',
            dialogPicture: false
        }
    },
    computed: {
        acountMoney() {
            if (this.reims.length === 0) {
                return '0.00'
            } else if (this.reims.length === 1) {
                return this.reims[0].money.toFixed(2)
            }
            return this.reims.reduce((base, reim) => {
                base = base.money || base
                return resolveFloat(base, reim.money)
            }).toFixed(2)
        },
        isSelf() {
            return this.$store.state.user.id === this.requestion.requester
        },
        uploadHeaders() {
            return {
                Authorization: 'Bearer ' + (this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5)))
            }
        }
    },
    methods: {
        formatTime,
        formatDate,
        setSeat(type, s) {
            if (!!s) {
                return seat[type][s].label
            }
            return ''
        },
        exportReim() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/exportReim')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: this.requestion.id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        window.open(res.text)
                    }
                })
        },
        exportCopy() {
            window.open('http://localhost:3000/static/copy.pdf')
        },
        exportFinanceReim() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/exportFinanceReim')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: this.requestion.id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        window.open(res.text)
                    }
                })
        },
        addNewReim() {
            this.$emit('addNewReim', this.newReim)
            this.dialog1Visible = false
        },
        handleRemove(file, fileList, index = undefined) {
            let body
            if (index === undefined) {
                body = {
                    id: file.response.id,
                    url: file.response.url
                }
            } else {
                body = {
                    id: file.id,
                    url: file.url
                }
            }
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/deleteInvoice')
                .set('Authorization', `Bearer ${token}`)
                .send(body)
                .end((err, res) => {
                    if (err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        if (index !== undefined) {
                            this.$emit('removeInvoice', index)
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                    }
                })
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogPicture = true
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
                money: '',
                note: ''
            }
            this.dialog1Visible = true
        },
        changeFeeType(value) {
            this.newReim.seat = ''
        },
        deleteReim(id, index) {
            this.$emit('deleteReim', id, index)
        }
    }
}
</script>
<style lang="stylus">
.reimwrapper
    text-align: left
    #printReimInfo
        display: none
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
        .addReim
            float: right
            margin-right: .1rem
            cursor: pointer
        .exportFinanceReim
            float: right
            margin-right: .1rem
            cursor: pointer
    .acount-money
        font-size: .14rem
        text-align: right
        padding-right: .3rem
    .invoice-wrapper
        &:after
            clear:both
            content:'.'
            display:block
            width: 0
            height: 0
            visibility:hidden
    .picture-content
        list-style: none
        position: relative
        width: 1.48rem
        height: 1.48rem
        border: 1px solid #c0ccda
        border-radius: .06rem
        box-sizing: border-box
        float: left
        margin-right: .1rem
        margin-bottom: .1rem
        img
            width: 100%
            height: 100%
        .picture-operate
            position: absolute
            width: 100%
            height: 100%
            line-height: 1.2rem
            left: 0
            top: 0
            cursor: default
            text-align: center
            color: #fff
            opacity: 0
            font-size: .2rem
            background-color: rgba(0,0,0,.5)
            -webkit-transition: opacity .3s
            transition: opacity .3s
            .icon
                display: none
                cursor: pointer
                &.picture-preview
                    margin-right: .1rem
            &:hover
                opacity: 0.96
                .icon
                    display: inline
</style>
