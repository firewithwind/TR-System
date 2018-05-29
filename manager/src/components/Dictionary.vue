<template>
    <div class="dictionary">
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                type="index"
                width="50%">
            </el-table-column>
            <el-table-column
                label="值">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.value"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                label="标签">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.label"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="update(scope.row)">
                        修改
                    </el-button>
                    <el-button type="text" style="color: #e6a23c" @click="deleteDic(scope.row.id, scope.$index)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="添加词典"
            :visible.sync="dialogVisible"
            width="30%">
            <span>值</span><el-input v-model="newDic.value" placeholder="请输入值"></el-input>
            <span>标签</span><el-input v-model="newDic.label" placeholder="请输入标签"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertDic">确 定</el-button>
            </span>
        </el-dialog>
        <el-button class="add" type="primary" @click="dialogVisible = true">
            添加
        </el-button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: [],
            newDic: {
                value: '',
                label: ''
            },
            dialogVisible: false
        }
    },
    mounted() {
        let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
        this.$request
            .post('/test/getDics')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    this.$message({
                        type: 'error',
                        message: err.response.text
                    })
                } else {
                    this.tableData = res.body
                }
            })
    },
    methods: {
        update(dic) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/updateDic')
                .set('Authorization', `Bearer ${token}`)
                .send(dic)
                .end((err, res) => {
                    if (err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                    }
                })
        },
        deleteDic(id, index) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/deleteDic')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: id
                })
                .end((err, res) => {
                    if (err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.tableData.splice(index, 1)
                    }
                })
        },
        insertDic() {
            if (isNaN(+this.newDic.value)) {
                this.$message('值必须为数字类型')
                return
            }
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/insertDic')
                .set('Authorization', `Bearer ${token}`)
                .send(this.newDic)
                .end((err, res) => {
                    if (err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        })
                        this.tableData.push({
                            ...this.newDic,
                            id: res.body
                        })
                        this.newDic = {
                            value: '',
                            label: ''
                        }
                        this.dialogVisible = false
                    }
                })
        }
    }
}
</script>
<style lang="stylus">
.dictionary
    text-align: left
    .add
        margin-top: .1rem
</style>
