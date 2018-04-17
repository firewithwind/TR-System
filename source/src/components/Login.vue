<template>
    <div class="login">
        <div class="form-wrapper">
            <p class="title">实验室差旅报销系统</p>
            <div class="input-wrapper">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xingmingyonghumingnicheng"></use>
                </svg>
                <input type="text" placeholder="输入用户名/手机号">
            </div>
            <div class="input-wrapper">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-icon-"></use>
                </svg>
                <input type="password" placeholder="输入密码">
            </div>
            <div class="help">
                <el-checkbox v-model="checked" class="check">记住密码</el-checkbox>
                <span class="forget">忘记密码？</span>
            </div>
            <div class="submit">
                <el-button>登入</el-button>
            </div>
            <div class="register-wrapper">
                <span>还没有账号?</span>
                <span class="content">注册</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            checked: false
        }
    }
}
</script>
<style lang="stylus">
.icon
    width: .16rem
    height: .16rem
    vertical-align: top
    color: #666
.login
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: linear-gradient(to right, #6190e8, #a7bfe8)
    font-size: .14rem
    .form-wrapper
        width: 2.8rem
        height: 3.4rem
        background: rgba(255, 255, 255, .2)
        padding: .2rem
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        margin: auto
        border-radius: .1rem
        .title
            font-size: .2rem
            font-family: 'Fantasy'
            margin-bottom: .4rem
        .input-wrapper
            width: 100%
            border-bottom: 1px solid #EBEEF5
            padding: .05rem
            text-align: left
            box-sizing: border-box
            margin-top: .2rem
            input
                width: 90%
                margin-left: .03rem
                border: none
                background: none
                outline: none
        .help
            margin-top: .1rem
            font-size: .12rem
            text-align: left
            .forget
                float: right
                cursor: pointer
            .check
                .el-checkbox__label
                    font-size: .12rem
                    padding-left: .05rem
        .submit
            margin-top: .3rem
            .el-button
                width: 70%
                background: rgba(255, 255, 255, .2)
                font-size: .16rem
        .register-wrapper
            margin-top: .3rem
            text-align: right
            .content
                cursor: pointer
                &:hover
                    color: #409EFF
</style>
