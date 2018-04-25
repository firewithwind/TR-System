<template>
    <div class="detail">
        <!-- <el-steps v-if="requestion.state!=0" class="state-wrapper" :active="requestion.state" align-center>
            <el-step v-for="step in steps" :key="step.title" :title="step.title" :description="step.desc"></el-step>
        </el-steps> -->
        <requestion :requestion="requestion" :inline="true" :isRemark="isRemark" @operateRequestion="dealOperate" @remarkRequestion="remark"></requestion>
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
                        this.requestion.approver = this.requestion.approver && this.requestion.approver.split(',')
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
                    let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
                    this.$request
                        .post('/test/deleteRequestion')
                        .set('Authorization', `Bearer ${token}`)
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
            } else {
                this.$message({
                    type: 'error',
                    message: '系统错误'
                })
            }
        },
        remark(ope, reason) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/approveRequestion')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: this.requestion.id,
                    uid: this.$store.state.user.id,
                    state: this.requestion.state,
                    operate: ope,
                    reason: reason
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
