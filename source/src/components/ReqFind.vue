<template>
    <div class="find">
        <el-form :model="param" label-width=".8rem" :inline="true">
            <el-form-item label="申请编号">
                <el-input v-model="param.id" placeholder="请输入申请单的ID" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户">
                <el-input v-model="param.name" placeholder="请输入用户名称或ID" clearable></el-input>
            </el-form-item>
            <el-form-item label="请求状态">
                <el-select v-model="param.state" clearable>
                    <el-option v-for="opt in steps" :key="opt.state" :value="opt.state" :label="opt.title"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属项目">
                <el-select v-model="param.project" clearable>
                    <el-option
                      v-for="item in projects"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                    v-model="daterange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="查询开始日期"
                    end-placeholder="查询结束日期">
                </el-date-picker>
            </el-form-item>
            <el-button class="find" type="primary" @click="getFindRequestion(1)">查询</el-button>
        </el-form>
        <p class="split">提示：将默认搜索用户自己的所有申请单，查询全部请在用户中输入all</p>
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
                prop="title"
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
        <div class="page-wrapper">
            <el-pagination
            layout="prev, pager, next"
            :total="acount"
            :page-size="limit.count"
            @current-change="changePage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {formatDate} from '@/utils'
import {stateEnum, steps} from '@/dataMap'
export default {
    data() {
        return {
            stateEnum,
            steps,
            param: {},
            requestions: [],
            daterange: [],
            limit: {
                offset: 0,
                count: 10
            },
            acount: 0,
            projects: []
        }
    },
    created() {
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
        getFindRequestion(cpage) {
            if (this.daterange && !!this.daterange.length) {
                this.param.startDate = new Date(this.daterange[0]).getTime() + ''
                this.param.endDate = new Date(this.daterange[1]).getTime() + ''
            } else {
                this.param.startDate = this.param.endDate = ''
            }
            if (!!this.param.id && isNaN(+this.param.id)) {
                this.$message({
                    type: 'error',
                    message: '请输入正确点申请单编号'
                })
                return
            }
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getFindRequestion')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...this.param,
                    user: this.$store.state.user.id,
                    limit: {
                        offset: 10 * (cpage - 1),
                        count: 10
                    }
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.requestions = res.body.results
                        this.acount = res.body.acount
                        if (res.body.acount === 0) {
                            this.$message({
                                type: 'warning',
                                message: '没有查询到对应的申请单'
                            })
                        }
                    }
                })
        },
        changePage(cpage) {
            this.getFindRequestion(cpage)
        },
        goForDetail(id) {
            this.$router.push('/reimbursement/index/detail?id=' + id)
        }
    }
}
</script>
<style lang="stylus">
.find
    text-align: left
    .el-form-item
        min-width: 30%
    .page-wrapper
        margin-top: .15rem
        text-align: right
    .split
        margin: .1rem 0
        font-size: .12rem
        text-indent: .1rem
        color: #E6A23C
    .find
        margin-left: .2rem
</style>
