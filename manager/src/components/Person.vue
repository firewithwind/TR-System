<template>
    <div class="person">
        <div class="find">
            <el-form :model="param" label-width="1rem" :inline="true">
                <el-form-item label="用户ID">
                    <el-input placeholder="输入用户ID" v-model="param.id" clearable></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input placeholder="输入用户姓名" v-model="param.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="职称">
                    <el-input placeholder="输入用户职称" v-model="param.jobTitle" clearable></el-input>
                </el-form-item>
                <el-form-item label="权限等级">
                    <el-input placeholder="输入权限等级" v-model="param.level" clearable></el-input>
                </el-form-item>
                <el-button type="primary" @click="getFindPersons">查询</el-button>
            </el-form>
        </div>
        <el-table :data="persons">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="id" label="用户ID"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="jobTitle" label="职称"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="Email" label="邮箱"></el-table-column>
            <el-table-column prop="laboratory" label="所在研究室"></el-table-column>
            <el-table-column prop="level" label="权限等级"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="showDialog(scope.row, scope.$index)">修改权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="请选择权限"
            :visible.sync="dialogVisible"
            width="50%">
            <el-radio v-model="currentPerson.level" :label="0">普通用户</el-radio>
            <el-radio v-model="currentPerson.level" :label="1">主任用户</el-radio>
            <el-radio v-model="currentPerson.level" :label="2">财务人员</el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePersonLevel">确 定</el-button>
            </span>
        </el-dialog>
        <el-pagination
            layout="prev, pager, next"
            :page-size="20"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            persons: [],
            currentPerson: {
                level: 0
            },
            oldLevel: 0,
            userIndex: 0,
            param: {
                id: '',
                name: '',
                jobTitle: '',
                level: ''
            },
            limit: {
                count: 20,
                offset: 0
            },
            total: 0,
            dialogVisible: false
        }
    },
    methods: {
        showDialog(user, index) {
            this.oldLevel = user.level
            this.userIndex = index
            this.currentPerson = {...user}
            this.dialogVisible = true
        },
        updatePersonLevel() {
            if (this.currentPerson.level === this.oldLevel) {
                this.dialogVisible = false
                return
            }
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/updatePersonLevel')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: this.currentPerson.id,
                    level: this.currentPerson.level
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
                            message: '修改成功'
                        })
                        this.persons[this.userIndex].level = this.currentPerson.level
                        this.dialogVisible = false
                    }
                })
        },
        getFindPersons() {
            if (this.param.level !== '' && isNaN(+this.param.level)) {
                this.$message({
                    type: 'error',
                    message: '请输入正确的权限等级'
                })
                return
            }
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getFindPersons')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    trans: this.param,
                    limit: this.limit
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.total = res.body.total
                        this.persons = res.body.result
                    }
                })
        }
    }
}
</script>
<style lang="stylus">
.person
    .find
        text-align: left
    .el-table
        text-align: left
    .el-pagination
        float: right
</style>
