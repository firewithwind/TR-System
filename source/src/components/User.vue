<template>
    <div class="user">
        <el-container>
            <el-main>
                <div class="avatar">
                    <img class="avatar-pic" :src="$store.state.user.avatar">
                    <el-upload
                        class="avatar-uploader"
                        action="test/uploadUserAvatar/"
                        :show-file-list="false"
                        accept="image/*"
                        :headers="uploadHeaders"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <el-form :model="user" label-position="right" label-width="2rem">
                    <el-form-item label="用户ID：">
                        <span>{{user.id}}</span>
                    </el-form-item>
                    <el-form-item label="姓名：">
                        <span v-if="!update">{{user.name}}</span>
                        <el-input v-else v-model="user.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="职称：">
                        <span>{{user.jobTitle}}</span>
                    </el-form-item>
                    <el-form-item label="联系电话：">
                        <span v-if="!update">{{user.phone}}</span>
                        <el-input v-else v-model="user.phone" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱地址：">
                        <span v-if="!update">{{user.Email}}</span>
                        <el-input v-else v-model="user.Email" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="权限等级：">
                        <span>{{user.level}}</span>
                    </el-form-item>
                    <el-form-item label="所属研究室：">
                        <span v-if="!update">{{user.laboratory}}</span>
                        <el-input v-else v-model="user.laboratory" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
                <div class="button-wrapper" v-if="!update">
                    <el-button type="primary" @click="update=true">
                        修改
                    </el-button>
                    <el-button type="danger" @click="logout">注销</el-button>
                </div>
                <div class="button-wrapper" v-else>
                    <el-button type="primary" @click="submit">
                        提交修改
                    </el-button>
                    <el-button @click="cancelUpdate">
                        取消
                    </el-button>
                </div>
            </el-main>
            <el-aside>
                <p class="title">消息</p>
                <div class="message-wrapper" ref="message">
                    <ul class="new">
                        <li v-for="(msg, index) in newMsgs" :key="msg.id" class="message-content" @click="showMessage(msg, index, 0)">
                            <span class="title">{{msg.title}}</span>
                            <span class="content" v-html="msg.data"></span>
                            <span class="time">{{formatDate(msg.occurTime)}}</span>
                        </li>
                    </ul>
                    <ul class="old">
                        <li v-for="(msg, index) in msgs" :key="msg.id" class="message-content" @click="showMessage(msg, index, 1)">
                            <span class="title">{{msg.title}}</span>
                            <span class="content" v-html="msg.data"></span>
                            <span class="time">{{formatDate(msg.occurTime)}}</span>
                        </li>
                    </ul>
                    <p v-if="!msgs.length&&!newMsgs.length" class="empty">没有消息~</p>
                </div>
            </el-aside>
        </el-container>
        <el-dialog
            :title="show.title"
            :visible.sync="dialogVisible"
            width="30%">
            <span v-html="show.data"></span>
            <p style="text-align: right">{{formatDate(show.occurTime)}}</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {formatDate} from '@/utils'

export default {
    data() {
        return {
            imageUrl: '',
            user: {},
            update: false,
            newMsgs: [],
            msgs: [],
            limit: {
                limit: 20,
                offset: 0
            },
            show: {
                title: ''
            },
            dialogVisible: false,
            requestable: true
        }
    },
    created() {
        let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
        if (!token) {
            this.$router.replace('/login')
        }
        this.getMessage()
    },
    mounted() {
        this.user = {...this.$store.state.user}
        if (!this.user.id) {
            setTimeout(() => {
                this.user = {...this.$store.state.user}
            }, 500)
        }
        this.setScrollEvent()
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
        cancelUpdate() {
            this.user = {...this.$store.state.user}
            this.update = false
        },
        handleAvatarSuccess(res, file) {
            this.$store.commit('setAvatar', res.url)
            this.user.avatar = res.url
            this.imageUrl = URL.createObjectURL(file.raw)
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isLt2M
        },
        setScrollEvent() {
            let doc = this.$refs.message
            console.log(doc.offsetTop, doc.offsetHeight)
            doc.addEventListener('scroll', (e) => {
                if (doc.scrollTop + doc.offsetHeight === doc.scrollHeight) {
                    if (this.requestable) {
                        this.requestable = false
                        this.getMessage()
                        setTimeout(() => {
                            this.requestable = true
                        }, 1000)
                    }
                }
            })
        },
        submit() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/updateUserInfor')
                .set('Authorization', 'Bearer ' + token)
                .send(this.user)
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.update = false
                        this.$store.commit('setUser', this.user)
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                    }
                })
        },
        logout() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/logout')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        localStorage.removeItem('token')
                        this.$store.state.socket.disconnect(true)
                        this.$store.commit('logout')
                        this.$router.replace('/login')
                    }
                })
        },
        getMessage() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getMessage')
                .set('Authorization', 'Bearer ' + token)
                .send(this.limit)
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.limit.offset += res.body.length
                        res.body.map((msg) => {
                            if (msg.state === 0) {
                                this.newMsgs.push(msg)
                            } else {
                                this.msgs.push(msg)
                            }
                        })
                    }
                })
        },
        showMessage(msg, index, state) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.show = msg
            this.dialogVisible = true
            if (state === 0) {
                this.$request
                    .post('/test/readMessage')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        uid: msg.uid,
                        id: msg.id
                    })
                    .end((err, res) => {
                        if (!!err) {
                            this.$message({
                                type: 'error',
                                message: err.response.text
                            })
                        } else {
                            this.newMsgs.splice(index, 1)
                            this.msgs.unshift(msg)
                        }
                    })
            }
        }
    }
}
</script>
<style lang="stylus">
.user
    .el-main
        margin-right: 3rem
        .avatar
            position: relative
            font-size: .14rem
            .avatar-pic
                position: absolute
                width: 1.5rem
                height: 1.5rem
                left: 0
                right: 0
                margin: 0 auto
                border-radius: .8rem
            .avatar-uploader .el-upload
                border: 1px dashed #d9d9d9
                border-radius: .8rem
                cursor: pointer
                position: relative
                overflow: hidden
                &:hover
                    border-color: #409EFF
            .avatar-uploader-icon
                font-size: .28rem
                color: #8c939d
                width: 1.5rem
                height: 1.5rem
                line-height: 1.5rem
                text-align: center
            .avatar
                width: 1.5rem
                height: 1.5rem
                display: block
        .el-form
            width: 60%
            margin: 0 auto
            text-align: left
    .el-aside
        position: fixed
        top: .61rem
        right: 0
        bottom: 0
        border-left: 1px solid #f2f6fc
        .title
            font-size: .18rem
            padding-bottom: .05rem
            border-bottom: 1px solid #F2F6FC
            margin: .05rem 0 0 0
        .message-wrapper
            width: 100%
            position: absolute
            top: .4rem
            bottom: 0
            overflow-y: auto
            ul
                text-align: left
                padding: 0
                .message-content
                    display: flex
                    padding: 0 .03rem
                    align-items: center
                    cursor: pointer
                    box-sizing: border-box
                    border-bottom: 1px solid #F2F6FC
                    &:hover
                        background: rgba(0, 0, 0, .03)
                    .title
                        flex: 0 1 auto
                        margin: .03rem 0 0 0
                        font-size: .14rem
                        padding: 0
                        border: none
                    .content
                        flex: 1 1 auto
                        font-size: .1rem
                        margin: 0 .05rem
                        white-space: nowrap
                        overflow: hidden
                        text-overflow: ellipsis
                    .time
                        flex: 0 0 auto
                        font-size: .12rem
            .new
                color: #409EFF
            .empty
                font-size: .18rem
                color: #C0C4CC
</style>
