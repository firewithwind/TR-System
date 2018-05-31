<template>
    <div class="project">
        <el-container>
            <el-aside>
                <el-form :model="param">
                    <el-form-item label="项目编号">
                        <el-input placeholder="请输入" v-model="param.id" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="创建日期">
                        <el-date-picker v-model="param.occurTime" value-format="timestamp" placeholder="请输入">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="项目名称">
                        <el-input v-model="param.title" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="getFindProjects">查询</el-button>
                </el-form>
            </el-aside>
            <el-main>
                <el-table :data="projects">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand" label-width=".8rem">
                                <el-form-item label="项目编号">
                                    <span>{{ props.row.id }}</span>
                                </el-form-item>
                                <el-form-item label="项目名称">
                                    <span>{{ props.row.title }}</span>
                                </el-form-item>
                                <el-form-item label="项目描述">
                                    <span v-if="!props.row.update">{{ props.row.description }}</span>
                                    <el-input v-else v-model="props.row.description"></el-input>
                                </el-form-item>
                                <el-form-item label="资金">
                                    <span v-if="!props.row.update">{{ (+props.row.funding).toFixed(2) }}</span>
                                    <el-input v-else v-model="props.row.funding"></el-input>
                                </el-form-item>
                                <el-form-item label="实际开支">
                                    <span>{{ (+props.row.overhead > 0 ? +props.row.overhead : 0).toFixed(2) }}</span>
                                </el-form-item>
                                <el-form-item label="预计开支">
                                    <span :class="getClass(props.row)">{{ (+props.row.alloverhead > 0 ? +props.row.alloverhead : 0).toFixed(2) }}</span>
                                </el-form-item>
                                <el-form-item label="超支上限">
                                    <span v-if="!props.row.update">{{ props.row.overflow }}</span>
                                    <el-input v-else v-model="props.row.overflow"></el-input>
                                </el-form-item>
                                <el-form-item label="创建时间">
                                    <span>{{ formatDate(props.row.occurTime) }}</span>
                                </el-form-item>
                                <el-form-item>
                                    <el-button v-if="!props.row.update&&hasACC" type="text" @click="updateProject(props.row, props.$index)">修改</el-button>
                                    <el-button v-if="props.row.update" type="text" @click="updateProject(props.row, props.$index)">提交</el-button>
                                    <el-button v-if="props.row.update" type="text" @click="cancelUpdateProject(props.row, props.$index)">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="项目编号"></el-table-column>
                    <el-table-column prop="title" label="项目名称"></el-table-column>
                    <el-table-column prop="funding" label="资金"></el-table-column>
                    <el-table-column label="实际开支">
                        <template slot-scope="scope">
                            <span>{{(+scope.row.overhead > 0 ? +scope.row.overhead : 0).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="预计开支">
                        <template slot-scope="scope">
                            <span :class="getClass(scope.row)">{{(+scope.row.alloverhead > 0 ? +scope.row.alloverhead : 0).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="overflow" label="超支上限"></el-table-column>
                    <el-table-column prop="occurTime" label="创建时间">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.occurTime)}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="limit.limit"
                    @current-change="changePage">
                </el-pagination>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import {formatDate} from '@/utils'

export default {
    data() {
        return {
            param: {
                id: '',
                title: '',
                occurTime: ''
            },
            projects: [],
            total: 0,
            limit: {
                limit: 20,
                offset: 0
            },
            currentProject: [],
            update: false
        }
    },
    computed: {
        hasACC() {
            return this.$store.state.user.level === 2
        }
    },
    methods: {
        formatDate,
        changePage(cpage) {
            this.limit.offset = 20 * (cpage - 1)
            this.getFindProjects()
        },
        updateProject(row, index) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            if (row.update) {
                this.$request
                    .post('/test/updateProject')
                    .set('Authorization', `Bearer ${token}`)
                    .send({...row})
                    .end((err, res) => {
                        if (!!err) {
                            this.$message({
                                type: 'error',
                                message: err.response.text
                            })
                        } else {
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            row.update = false
                        }
                    })
            } else {
                this.currentProject[index] = {...row}
                row.update = true
            }
        },
        cancelUpdateProject(row, index) {
            this.projects[index].description = this.currentProject[index].description
            this.projects[index].funding = this.currentProject[index].funding
            this.projects[index].overflow = this.currentProject[index].overflow
            this.projects[index].update = false
        },
        getClass(row) {
            if (+row.alloverhead >= +row.funding * (1 + row.overflow / 100) - 100) {
                return 'danger'
            }
            return ''
        },
        getFindProjects() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getFindProjects')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: this.param,
                    limit: this.limit
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.projects = res.body.result.map((pro) => {
                            return {
                                ...pro,
                                update: false
                            }
                        })
                        this.total = res.body.total
                    }
                })
        }
    }
}
</script>
<style lang="stylus">
.project
    .el-aside
        position: fixed
        padding: .1rem
        width: 3rem
        top: .61rem
        left: 0
        bottom: 0
        border-right: 1px solid #EBEEF5
        .el-input
            max-width: 75%
    .el-main
        margin-left: 3rem
        .el-table
            text-align: left
            .el-form-item
                min-width: 30%
            .danger
                color: red
        .el-pagination
            float: right
</style>
