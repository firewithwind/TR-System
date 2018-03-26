<template>
    <div class="detail">
        <requestion :requestion="requestion" :inline="true" :isRemark="isRemark" @operateRequestion="dealOperate" :reims="reims"></requestion>
    </div>
</template>
<script>
import Requestion from '@/components/Requestion'
import {query} from '@/utils'
export default {
    components: {
        Requestion
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
        },
        dealOperate(requestion, rem, ope) {
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
                if (this.$store.state.user.id === this.requestion.requester) {
                    if (!rem) {
                        this.$message({
                            type: 'error',
                            message: '请添加报销项'
                        })
                    } else {
                        this.$request
                            .post('/test/addReimbursement')
                            .send({
                                rem: rem
                            })
                            .end((err, res) => {
                                if (!!err) {
                                    console.log(err)
                                } else {
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
            }
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>
