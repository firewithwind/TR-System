<template>
    <div class="policy">
        <div v-if="editering" id="editor"></div>
        <el-table :data="policys">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="occurTime" label="创建时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="goForDetail(scope.row.id)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :page-size="20"
            :total="total">
        </el-pagination>
        <el-button class="add-policy" type="primary" size="mini" @click="goForAdd">添加</el-button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            policys: [],
            editering: false,
            limit: 20,
            offset: 0,
            total: 0
        }
    },
    created() {
        let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
        this.$request
            .post('/test/getPolicys')
            .set('Authorization', `Bearer ${token}`)
            .send({
                limit: this.limit,
                offset: this.offset
            })
            .end((err, res) => {
                if (!!err) {
                    this.$message({
                        type: 'error',
                        message: err.response.text
                    })
                } else {
                    this.total = res.body.total
                    this.policys = res.body.result
                }
            })
    },
    methods: {
        goForDetail(id) {
            this.$router.push('/manage/policy/detail?id=' + id)
        },
        goForAdd() {
            this.$router.push('/manage/policy/detail?isCreate=true')
        }
    }
}
</script>
<style lang="stylus">
.policy
    text-align: left
    .el-pagination
        float: right
    .add-policy
        margin-top: .05rem
</style>
