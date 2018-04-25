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
                <el-button v-if="!update" type="primary" @click="update=true">
                    修改
                </el-button>
                <div v-else>
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
            </el-aside>
        </el-container>
    </div>
</template>
<script>
export default {
    data() {
        return {
            imageUrl: '',
            user: {},
            update: false
        }
    },
    mounted() {
        this.user = {...this.$store.state.user}
        if (!this.user.id) {
            setTimeout(() => {
                this.user = {...this.$store.state.user}
            }, 500)
        }
    },
    computed: {
        uploadHeaders() {
            return {
                Authorization: 'Bearer ' + (this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5)))
            }
        }
    },
    methods: {
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
        }
    }
}
</script>
<style lang="stylus">
.user
    .el-main
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
</style>
