<template>
    <div class="unremark">
        <el-table :data="requestions">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="id"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="name"
                label="申请人">
            </el-table-column>
            <el-table-column
                prop="project"
                label="所属项目">
            </el-table-column>
            <el-table-column
                label="创建时间">
                <template slot-scope="scope">
                    {{formatDate(scope.row.occurTime)}}
                </template>
            </el-table-column>
            <el-table-column
                label="当前状态">
                <template slot-scope="scope">
                    {{stateEnum[scope.row.state]}}
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                label="描述">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="goForDetail(scope.row.id)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {formatDate} from '@/utils'
import {stateEnum} from '@/dataMap'
export default {
    data() {
        return {
            stateEnum,
            requestions: []
        }
    },
    created() {
        this.getUnremarkRequestion()
    },
    methods: {
        formatDate,
        getUnremarkRequestion() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getUnremarkRequestion')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    if (!!err) {
                        this.requestions = []
                        console.log(err)
                    } else {
                        this.requestions = res.body
                    }
                })
        },
        goForDetail(id) {
            this.$router.push('/reimbursement/index/reqdetail?id=' + id + '&isRemark=1')
        }
    }
}
</script>
<style lang="stylus">
.unremark
    text-align: left
</style>
