<template>
    <div class="create-reim">
        <el-steps v-if="requestion.state!=0" class="state-wrapper" :active="requestion.state" align-center>
            <el-step v-for="step in steps" :key="step.title" :title="step.title" :description="step.desc"></el-step>
        </el-steps>
        <el-form v-if="!!requestion" class="requestion-wrapper" v-model="requestion" label-width="0.8rem" :inline="true">
            <el-form-item label="申请人:">
                {{requestion.name}}
            </el-form-item>
            <el-form-item label="研究室:">
                {{$store.state.user.laboratory}}
            </el-form-item>
            <el-form-item label="所属项目:">
                <span>{{requestion.title}}</span>
            </el-form-item>
            <el-form-item label="申请时间:">
                <span>{{formatDate(requestion.occurTime)}}</span>
            </el-form-item>
            <el-form-item label="申请描述:">
                <span>{{requestion.description}}</span>
            </el-form-item>
        </el-form>
        <reim-wrapper :requestion="requestion" :reims="reims" :pics="pics" @addNewReim="addNewReim" @deleteReim="deleteReim" @removeInvoice="removeInvoice" :isRemark="isRemark"></reim-wrapper>
        <el-dialog
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="remarkClose">
            <template>
                <el-radio v-model="remarkResult" :label="0">通过</el-radio>
                <el-radio v-model="remarkResult" :label="1">驳回</el-radio>
            </template>
            <div v-if="!remarkResult">
                <span>选择报销项目：</span>
                <el-select v-model="selectPro">
                    <el-option v-for="pro in projects"
                            :value="pro.id"
                            :label="pro.title"
                            :key="pro.id">
                    </el-option>
                </el-select>
            </div>
            <div v-if="!remarkResult" style="margin-top: .1rem">
                <span>选择室内交通报销项目：</span>
                <el-select v-model="selectPro2">
                    <el-option v-for="pro in projects"
                            :value="pro.id"
                            :label="pro.title"
                            :key="pro.id">
                    </el-option>
                </el-select>
            </div>
            <el-input
                v-if="!!remarkResult"
                type="textarea"
                autosize
                placeholder="请输入驳回原因"
                v-model="remarkReason">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="remark">确 定</el-button>
            </span>
        </el-dialog>
        <div class="operate-wrapper">
            <el-button v-if="(requestion.state>=3&&requestion.state<4)&&isRemark" type="primary" class="submit" @click="dialogVisible=true">审批</el-button>
            <el-button v-if="requestion.state===4&&isRemark" type="primary" class="submit" @click="endInvoice">已收票</el-button>
        </div>
    </div>
</template>
<script>
import {formatDate, query} from '@/utils'
import ReimWrapper from '@/components/ReimWrapper'
import {steps} from '@/dataMap'
export default {
    components: {
        ReimWrapper
    },
    data() {
        return {
            steps,
            select: '',
            opts: [],
            requestion: {},
            reims: [],
            isRemark: false,
            dialogVisible: false,
            remarkResult: 0,
            remarkReason: '',
            pics: [],
            selectPro: '',
            selectPro2: '',
            projects: []
        }
    },
    created() {
        let step = location.href.split('?')
        let param = query(step[1])
        if (!!param.isRemark) {
            this.isRemark = true
        }
        this.getRequestionDetail(param.id, this.getInvoices)
        this.getProjects()
    },
    methods: {
        formatDate,
        getProjects() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getProjects')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.projects = res.body
                    }
                })
        },
        acountMoney() {
            let result = []
            let proReim = this.reims.filter((reim) => {
                if (reim.type === 34) {
                    return false
                }
                return true
            })
            let pro2Reim = this.reims.filter((reim) => {
                if (reim.type === 34) {
                    return true
                }
                return false
            })
            result[0] = this.calculateAcount(proReim)
            result[1] = this.calculateAcount(pro2Reim)
            return result
        },
        calculateAcount(reims) {
            if (reims.length === 0) {
                return 0
            } else if (reims.length === 1) {
                return reims[0].money
            }
            return reims.reduce((base, reim) => {
                base = base.money || base
                return base + reim.money
            })
        },
        endInvoice() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/approveRequestion')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: this.requestion.id,
                    uid: this.$store.state.user.id,
                    requester: this.requestion.requester,
                    description: this.requestion.description,
                    state: this.requestion.state,
                    operate: 0,
                    reason: ''
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.$message({
                            type: 'success',
                            message: '已完成'
                        })
                        this.getRequestionDetail(this.requestion.id)
                    }
                })
        },
        removeInvoice(index) {
            this.pics.splice(index, 1)
        },
        getInvoices() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getInvoices')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    requestion: this.requestion.id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.pics = res.body
                    }
                })
        },
        remarkClose() {
            this.dialogVisible = false
        },
        remark() {
            if (!this.remarkResult && (!this.selectPro || !this.selectPro2)) {
                this.$message({
                    type: 'error',
                    message: '请选择报销来源的项目'
                })
                return
            }
            if (!!this.remarkResult && !this.remarkReason) {
                this.$message({
                    type: 'error',
                    message: '请输入驳回原因'
                })
                return
            }
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/approveRequestion')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: this.requestion.id,
                    uid: this.$store.state.user.id,
                    oldProject: this.requestion.project,
                    requester: this.requestion.requester,
                    description: this.requestion.description,
                    state: this.requestion.state,
                    operate: this.remarkResult,
                    reason: this.remarkReason,
                    acountMoney: this.acountMoney(),
                    project: this.selectPro,
                    project2: this.selectPro2
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.$message({
                            type: 'success',
                            message: '已审批'
                        })
                        this.getRequestionDetail(this.requestion.id)
                    }
                })
            this.dialogVisible = false
        },
        getRequestionDetail(id, callback = undefined) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getRequestionDetail')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.requestion = res.body
                        this.selectPro = res.body.project
                        if (!!callback) {
                            callback()
                        }
                    }
                })
            this.$request
                .post('/test/getReimbursements')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.reims = res.body
                    }
                })
        },
        selectReq(val) {
            this.requestion = this.opts[val]
        },
        addNewReim(rem) {
            if (this.$store.state.user.id === this.requestion.requester) {
                if (!rem) {
                    this.$message({
                        type: 'error',
                        message: '请添加报销项'
                    })
                } else {
                    let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
                    rem.startDate = new Date(rem.startDate).getTime()
                    rem.startTime = new Date(rem.startTime).getTime()
                    rem.endDate = new Date(rem.startDate).getTime()
                    rem.endTime = new Date(rem.endTime).getTime()
                    this.$request
                        .post('/test/addReimbursement')
                        .set('Authorization', `Bearer ${token}`)
                        .send({
                            requestion: this.requestion.id,
                            uid: this.$store.state.user.id,
                            project: this.requestion.project,
                            ...rem
                        })
                        .end((err, res) => {
                            if (!!err) {
                                console.log(err)
                            } else {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                })
                                this.reims.push(rem)
                            }
                        })
                }
            } else {
                this.$message({
                    type: 'error',
                    message: '系统错误'
                })
            }
        },
        deleteReim(id, index) {
            this.$confirm('将会删除报销条目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
                this.$request
                    .post('/test/deleteReim')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        id: id
                    })
                    .end((err, res) => {
                        if (!!err) {
                            console.log(err)
                        } else {
                            this.reims.splice(index, 1)
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                        }
                    })
            })
        }
    }
}
</script>
<style lang="stylus">
.create-reim
    text-align: left
    .state-wrapper
        margin-top: .3rem
        margin-bottom: .5rem
    .requestion-wrapper
        border-bottom: 1px solid #F2F6FC
    .label
        font-size: .14rem
    .el-form
        font-size: .14rem
        .el-form-item
            min-width: 30%
    .operate-wrapper
        width: 100%
        margin-top: .2rem
</style>
