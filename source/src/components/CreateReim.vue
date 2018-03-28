<template>
    <div class="create-reim">
        <span class="label">选择申请：</span>
        <el-select v-model="select" placeholder="选择申请表" @change="selectReq">
            <el-option v-for="(opt, index) in opts" :key="opt.id" :label="opt.description" :value="index"></el-option>
        </el-select>
        <el-form v-if="!!requestion" class="requestion-wrapper" v-model="requestion" label-width="0.8rem" :inline="true">
            <el-form-item label="申请人:">
                {{requestion.name}}
            </el-form-item>
            <el-form-item label="实验室:">
                {{requestion.laboratory}}
            </el-form-item>
            <el-form-item label="所属项目:">
                <span>{{requestion.project}}</span>
            </el-form-item>
            <el-form-item label="申请时间:">
                <span>{{formatDate(requestion.occurTime)}}</span>
            </el-form-item>
        </el-form>
        <reim-wrapper :requestion="requestion" :reims="reims" @addNewReim="addNewReim"></reim-wrapper>
    </div>
</template>
<script>
import {formatDate} from '@/utils'
import ReimWrapper from '@/components/ReimWrapper'
export default {
    components: {
        ReimWrapper
    },
    data() {
        return {
            select: '',
            opts: [],
            requestion: {},
            reims: []
        }
    },
    created() {
        this.getCreatableReim()
    },
    methods: {
        formatDate,
        getCreatableReim() {
            this.$request
                .post('/test/getCreatableReim')
                .send({
                    id: this.$store.state.user.id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.opts = res.body
                    }
                })
        },
        selectReq(val) {
            this.requestion = this.opts[val]
        },
        addNewReim(rem) {
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
</script>
<style lang="stylus">
.create-reim
    text-align: left
    .requestion-wrapper
        border-bottom: 1px solid #F2F6FC
    .label
        font-size: .14rem
    .el-form
        margin-top: .4rem
        font-size: .14rem
        .el-form-item
            min-width: 30%
</style>
