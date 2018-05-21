<template>
    <div class="policy-detail">
        <h3 v-if="!editoring" class="title">{{policy.title}}</h3>
        <el-input v-if="editoring" class="title" v-model="policy.title" placeholder="输入标题"></el-input>
        <p class="time"><span v-if="!isCreate">创建时间：{{formatDate(policy.occurTime)}}</span></p>
        <div class="policy-content">
            <p v-show="!editoring" class="content" v-html="policy.data"></p>
            <div v-show="editoring" id="editor"></div>
        </div>
        <div class="file-wrapper" v-if="!isCreate">
            <el-upload
                class="upload-demo"
                :action="`test/uploadPolicyFile?id=${policy.id}`"
                :headers="uploadHeaders"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :file-list="fileList"
                :on-success="uploadFinished">
              <el-button size="small" type="primary">点击上传</el-button>
              <div v-if="!fileList.length" slot="tip" class="el-upload__tip">选择上传的附件</div>
            </el-upload>
        </div>
        <el-button v-if="!editoring" type="primary" size="mini" @click="goForEditor">修改</el-button>
        <el-button v-if="!editoring" type="danger" size="mini" @click="deletePolicy">删除</el-button>
        <el-button v-if="editoring" type="primary" size="mini" @click="submit">提交</el-button>
        <el-button v-if="editoring" size="mini" @click="cancel">取消</el-button>
    </div>
</template>
<script>
import {query, formatDate} from '@/utils'

export default {
    data() {
        return {
            fileList: [],
            policy: {
                id: '',
                title: '',
                data: '',
                occurTime: ''
            },
            editoring: false,
            editor: null,
            oldTitle: '',
            isCreate: false
        }
    },
    created() {
        let param = query(location.href.split('?')[1])
        if (!!param.id) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getPolicyDetail')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: param.id
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.policy = res.body
                    }
                })
            this.getPolicyFiles(param.id)
        } else if (!!param.isCreate) {
            this.editoring = true
            this.isCreate = true
        }
    },
    mounted() {
        this.editor = new this.$editor('#editor')
        this.editor.create()
    },
    computed: {
        uploadHeaders() {
            return {
                Authorization: 'Bearer ' + (this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5)))
            }
        }
    },
    methods: {
        formatDate,
        cancel() {
            if (!!this.policy.id) {
                this.editor.txt.html(this.policy.data)
                this.editoring = false
                this.policy.title = this.oldTitle
            } else {
                this.$router.go(-1)
            }
        },
        getPolicyFiles(id) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getPolicyFiles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: id
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        res.body.forEach((item) => {
                            this.fileList.push({
                                name: `附件${this.fileList.length + 1}`,
                                url: item.url,
                                id: item.id
                            })
                        })
                    }
                })
        },
        uploadFinished(response, file, fileList) {
            this.fileList.push({
                name: `附件${this.fileList.length + 1}`,
                id: response.id,
                url: response.url
            })
        },
        handleRemove(file, fileList) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/deletePolicyFile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: file.id,
                    url: file.url
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
                            message: '删除成功'
                        })
                        let index = this.fileList.indexOf(file)
                        this.fileList.splice(index, 1)
                    }
                })
        },
        handlePreview(file) {
            window.open(file.url)
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`)
        },
        goForEditor() {
            this.oldTitle = this.policy.title
            this.editor.txt.html(this.policy.data)
            this.editoring = true
        },
        submit() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            if (this.isCreate) {
                this.$request
                    .post('/test/insertPolicy')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        title: this.policy.title,
                        data: this.editor.txt.html()
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
                                message: '创建成功'
                            })
                            this.policy = res.body
                            this.editoring = false
                            this.isCreate = false
                        }
                    })
            } else {
                this.$request
                .post('/test/updatePolicy')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: this.policy.id,
                    title: this.policy.title,
                    data: this.editor.txt.html()
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.policy.data = this.editor.txt.html()
                        this.editoring = false
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                    }
                })
            }
        },
        deletePolicy() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/deletePolicy')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: this.policy.id
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
                            message: '删除成功'
                        })
                        this.$router.replace('/manage/policy')
                    }
                })
        }
    }
}
</script>
<style lang="stylus">
.policy-detail
    .title
        width: 60%
        margin: 0 auto
        font-size: .2rem
    .time
        font-size: .12rem
    .policy-content
        margin: 0 auto .1rem
        text-align: left
        overflow: auto
        .content
            table
                border-left: 1px solid #DCDFE6
                border-top: 1px solid #DCDFE6
                th, td
                    border-right: 1px solid #DCDFE6
                    border-bottom: 1px solid #DCDFE6
    .file-wrapper
        margin-bottom: .1rem
        text-align: left
    #editor
        border: 1px solid #F2F6FC
        min-height: 3rem
</style>
