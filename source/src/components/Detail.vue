<template>
    <div class="detail">
        <requestion :requestion="requestion" :inline="true" :isRemark="isRemark" @operateRequestion="dealOperate" @remarkRequestion="remark" :reims="reims"></requestion>
        <!-- <reim-wrapper :requestion="requestion" :inline="true" :isRemark="isRemark" @operateRequestion="dealOperate" @remarkRequestion="remark" :reims="reims"></reim-wrapper> -->
    </div>
</template>
<script>
import Requestion from '@/components/Requestion'
import ReimWrapper from '@/components/ReimWrapper'
import {query} from '@/utils'
export default {
    components: {
        Requestion,
        ReimWrapper
    },
    data() {
        return {
            requestion: {},
            reims: [],
            isRemark: false
        }
    },
    created() {
        let step = location.href.split('?')
        let param = query(step[1])
        if (!!param.isRemark) {
            this.isRemark = true
        }
        this.getRequestionDetail(param.id)
    },
    methods: {
        getRequestionDetail(id) {
            this.$request
                .post('/test/getRequestionDetail')
                .send({
                    id: id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.requestion = res.body
                    }
                })
            this.$request
                .post('/test/getReimbursements')
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
        dealOperate(rem, ope) {
            if (ope === 0) {
                this.$confirm('请求撤销后无法恢复，您确定要撤销吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request
                        .post('/test/deleteRequestion')
                        .send({
                            uid: this.$store.state.user.id,
                            id: this.requestion.id
                        })
                        .end((err, res) => {
                            if (!!err) {
                                console.log(err)
                            } else {
                                this.$router.go(-1)
                                this.$message({
                                    type: 'success',
                                    message: '已撤销!'
                                })
                            }
                        })
                })
            } else if (ope === 1) {
                if (this.$store.state.user.id === +this.requestion.requester) {
                    if (!rem) {
                        this.$message({
                            type: 'error',
                            message: '请添加报销项'
                        })
                    } else {
                        rem.startDate = new Date(rem.startDate).getTime()
                        rem.startTime = new Date(rem.startTime).getTime()
                        rem.endDate = new Date(rem.startDate).getTime()
                        rem.endTime = new Date(rem.endTime).getTime()
                        this.$request
                            .post('/test/addReimbursement')
                            .send({
                                requestion: this.requestion.id,
                                uid: this.$store.state.user.id,
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
                                    this.requestion.state = 3
                                }
                            })
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: '系统错误'
                    })
                }
            }
        },
        remark(ope, resion) {
            this.$request
                .post('/test/approveRequestion')
                .send({
                    id: this.requestion.id,
                    uid: this.$store.state.user.id,
                    state: this.requestion.state,
                    operate: ope,
                    resion: resion
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
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>
