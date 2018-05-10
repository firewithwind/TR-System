<template>
    <div class="detail">
        <requestion id="requestion" :requestion="requestion" :inline="true"></requestion>
        <reim-wrapper :requestion="requestion" :reims="reims" :pics="pics" @addNewReim="addNewReim" @deleteReim="deleteReim" @removeInvoice="removeInvoice"></reim-wrapper>
    </div>
</template>
<script>
import Requestion from '@/components/Requestion'
import ReimWrapper from '@/components/ReimWrapper'
import {query, formatDate} from '@/utils'
import {feeTypesEnum} from '@/dataMap'

export default {
    components: {
        Requestion,
        ReimWrapper
    },
    data() {
        return {
            feeTypesEnum,
            requestion: {
                user: '',
                name: '',
                laboratory: '',
                state: 0,
                dataRange: [],
                way: 30,
                destination: '',
                description: '',
                approver: []
            },
            reims: [],
            pics: []
        }
    },
    created() {
        let step = location.href.split('?')
        let param = query(step[1])
        if (!!param.isRemark) {
            this.isRemark = true
        }
        this.getRequestionDetail(param.id, this.getInvoices)
    },
    methods: {
        formatDate,
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
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.pics = res.body
                    }
                })
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
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.requestion = res.body
                        callback()
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
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.reims = res.body
                    }
                })
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
                                this.$message({
                                    type: 'error',
                                    message: err.response.text
                                })
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
                            this.$message({
                                type: 'error',
                                message: err.response.text
                            })
                        } else {
                            this.reims.splice(index, 1)
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                        }
                    })
            })
        },
        removeInvoice(index) {
            this.pics.splice(index, 1)
        }
    }
}
</script>
<style lang="stylus" scoped>
.detail
    text-algin: left
</style>
