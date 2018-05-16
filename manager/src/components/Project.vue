<template>
    <div class="project">
        <el-form :model="param" :inline="true">
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
                            <span v-if="!update">{{ props.row.description }}</span>
                            <el-input v-else v-model="currentProject.description"></el-input>
                        </el-form-item>
                        <el-form-item label="资金">
                            <span v-if="!update">{{ (+props.row.funding).toFixed(2) }}</span>
                            <el-input v-else v-model="currentProject.funding"></el-input>
                        </el-form-item>
                        <el-form-item label="实际开支">
                            <span>{{ (+props.row.overhead > 0 ? +props.row.overhead : 0).toFixed(2) }}</span>
                        </el-form-item>
                        <el-form-item label="预计开支">
                            <span>{{ (+props.row.alloverhead > 0 ? +props.row.alloverhead : 0).toFixed(2) }}</span>
                        </el-form-item>
                        <el-form-item label="超支上限">
                            <span v-if="!update">{{ props.row.overflow }}%</span>
                            <el-input v-else v-model="currentProject.overflow">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <span>{{ formatDate(props.row.occurTime) }}</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button v-if="!update&&hasACC" type="text" @click="updateProject(props.row)">修改</el-button>
                            <el-button v-if="update" type="text" @click="updateProject(props.row, props.$index)">提交</el-button>
                            <el-button v-if="update" type="text" @click="update=false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="项目编号"></el-table-column>
            <el-table-column prop="title" label="项目名称"></el-table-column>
            <el-table-column prop="funding" label="资金"></el-table-column>
            <el-table-column prop="overhead" label="实际开支">
                <template slot-scope="scope">
                    <span>{{ (+scope.row.overhead > 0 ? +scope.row.overhead : 0).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="预计开支">
                <template slot-scope="scope">
                    <span :class="getClass(scope.row)">{{ (+scope.row.alloverhead > 0 ? +scope.row.alloverhead : 0).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="overflow" label="超支上限">
                <template slot-scope="scope">
                    {{scope.row.overflow}}%
                </template>
            </el-table-column>
            <el-table-column prop="occurTime" label="创建时间">
                <template slot-scope="scope">
                    {{formatDate(scope.row.occurTime)}}
                </template>
            </el-table-column>
        </el-table>
        <el-button class="addProject" type="primary" size="mini" @click="dialogVisible = true">添加项目</el-button>
        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="limit.limit"
            @current-change="changePage">
        </el-pagination>
        <el-dialog
            class="new-project"
            title="添加项目"
            :visible.sync="dialogVisible"
            width="50%">
            <el-form ref="form" :model="newProject" label-width="1rem">
                <el-form-item label="项目名称：">
                    <el-input v-model="newProject.title" placeholder="输入项目名称"></el-input>
                </el-form-item>
                <el-form-item label="项目描述：">
                    <el-input v-model="newProject.description" placeholder="输入项目描述"></el-input>
                </el-form-item>
                <el-form-item label="项目资金：">
                    <el-input v-model="newProject.funding" placeholder="输入项目资金"></el-input>
                </el-form-item>
                <el-form-item label="超支上限：">
                    <el-input v-model="newProject.overflow" placeholder="输入超支上限">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addProject">确 定</el-button>
            </span>
        </el-dialog>
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
            currentProject: {
                description: '',
                funding: '',
                overflow: ''
            },
            newProject: {
                title: '',
                funding: '',
                description: '',
                overflow: ''
            },
            update: false,
            dialogVisible: false
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
        addProject() {
            if (!this.newProject.title) {
                this.$message('请输入项目名称')
                return
            }
            if (!this.newProject.description) {
                this.$message('请输入项目描述')
                return
            }
            if (!this.newProject.funding || isNaN(+this.newProject.funding)) {
                this.$message('请输入正确的项目资金')
                return
            }
            if (!this.newProject.overflow || isNaN(+this.newProject.overflow)) {
                this.$message('请输入正确的超支上限')
                return
            }
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/addProject')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...this.newProject,
                    name: this.$store.state.user.name
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
                        this.newProject = {
                            title: '',
                            funding: '',
                            description: '',
                            overflow: ''
                        }
                    }
                    this.dialogVisible = false
                })
        },
        updateProject(row, index) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            if (this.update) {
                this.$request
                    .post('/test/updateProject')
                    .set('Authorization', `Bearer ${token}`)
                    .send(this.currentProject)
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
                            this.projects[index] = this.currentProject
                            this.update = false
                        }
                    })
            } else {
                this.currentProject = {...row}
                this.update = true
            }
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
                        this.projects = res.body.result
                        this.total = res.body.total
                    }
                })
        }
    }
}
</script>
<style lang="stylus">
.project
    font-size: .14rem
    .el-form
        .el-form-item
            width: 28%
    .el-table
        text-align: left
        .el-form-item
            min-width: 30%
        .danger
            color: red
    .el-pagination
        float: right
    .addProject
        margin-top: .08rem
        float: left
    .new-project
        .el-form-item
            width: 100%
</style>
