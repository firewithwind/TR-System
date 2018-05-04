<template>
    <div class="index">
        <el-container>
            <el-aside width="4rem">
                <el-card class="aside-card feedback">
                    <div slot="header">
                        <span>问题反馈</span>
                    </div>
                    <div class="aside-content">
                        <span>如有问题，请联系17862702878</span>
                    </div>
                </el-card>
                <el-card class="aside-card">
                    <div class="aside-header" slot="header" style="padding: 0">
                        <span>报销政策</span>
                        <el-button class="more" type="text">更多></el-button>
                    </div>
                    <div  v-for="policy in policys" :key="policy.text" class="aside-content" @click="goRouter(policy.path)">
                        <span>{{policy.text}}</span>
                    </div>
                </el-card>
                <el-card class="aside-card">
                    <div class="aside-header" slot="header">
                        <span>常见问题</span>
                        <el-button class="more" type="text">更多></el-button>
                    </div>
                    <div class="aside-content">
                        <span>常见问题解决方案</span>
                    </div>
                </el-card>
            </el-aside>
            <el-main>
                <div class="content-wrapper">
                    <div class="main-card process">
                        <div class="header">
                            <span>报销流程</span>
                        </div>
                        <div class="content">
                            <process></process>
                        </div>
                    </div>
                    <div class="main-card bulletin">
                        <div class="header">
                            <span>公告</span>
                            <el-button class="more" type="text">更多></el-button>
                        </div>
                        <div class="content">
                            <div class="no-bulletin">暂无公告~</div>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
        <div class="footer">
            <span>哈尔滨工业大学(威海)</span><span style="margin-left: .2rem">{{$store.state.user.laboratory}}</span>
        </div>
    </div>
</template>

<script>
import Process from '@/components/Process'

export default {
    name: 'Index',
    components: {
        Process
    },
    data () {
        return {
            policys: [
                {
                    text: '报销注意事项',
                    path: '/policy/precautions'
                },
                {
                    text: '差旅管理办法',
                    path: '/policy/precautions'
                },
                {
                    text: '交通工具等级标准',
                    path: '/policy/precautions'
                },
                {
                    text: '住宿标准',
                    path: '/policy/precautions'
                }
            ]
        }
    },
    created() {
        let id = localStorage.getItem('user')
        if (!id) {
            this.$router.replace('/login')
        }
    },
    methods: {
        goRouter(path) {
            this.$router.push(path)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.index
    font-size: .18rem
    .el-aside
        padding: .2rem .1rem
        .aside-card
            font-size: .16rem
            margin-bottom: .1rem
            text-align: left
            .aside-header
                &:after
                    display: table
                    content: ''
                    clear: both
                .more
                    padding: 0
                    float: right
            .aside-content
                font-size: .14rem
                padding: .03rem
                cursor: pointer
                border-bottom: .02rem dotted #F2F6FC
        .feedback
            .aside-content
                cursor: text
    .el-main
        padding: .2rem .1rem
        .content-wrapper
            padding: .1rem .15rem
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
            border: 1px solid #ebeef5
            color: #303133
            text-align: left
            .main-card
                .header
                    height: .24rem
                    padding-bottom: .04rem
                    font-size: .16rem
                    border-bottom: .01rem solid #ebeef5
                    .more
                        float: right
                        margin-top: -0.04rem
                .content
                    padding: .2rem 0
                    .no-bulletin
                        font-size: .16rem
                        padding: .76rem 0
                        text-align: center
    .footer
        position: fixed
        bottom: 0
        height: .6rem
        width: 100%
        background-color: rgb(84, 92, 100)
        line-height: .6rem
        color: #fff
</style>
