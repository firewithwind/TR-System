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
                        <span>报销政策&公告</span>
                        <el-button class="more" type="text" @click="goRouter('policy')">更多></el-button>
                    </div>
                    <span v-if="!policys.length">暂无数据哦~</span>
                    <div  v-for="policy in policys" :key="policy.id" class="aside-content" @click="goRouter(`/policy/detail?id=${policy.id}`)">
                        <span>{{policy.title}}</span>
                    </div>
                </el-card>
                <el-card class="aside-card">
                    <div class="aside-header" slot="header">
                        <span>常见问题</span>
                        <el-button class="more" type="text" @click="goRouter('question')">更多></el-button>
                    </div>
                    <span v-if="!questions.length">暂无数据哦~</span>
                    <div v-for="question in questions" :key="question.id" class="aside-content" @click="goRouter(`/question/detail?id=${question.id}`)">
                        <span>{{question.title}}</span>
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
                            <span>通知</span>
                            <el-button class="more" type="text" @click="goRouter('announcement')">更多></el-button>
                        </div>
                        <div class="content">
                            <div v-if="!announcements.length" class="no-bulletin">暂无通知~</div>
                            <div class="entry" v-for="item in announcements" :key="item.id" @click="goRouter(item.url)">
                                <span class="title">{{item.title}}</span>
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content" v-html="item.data"></div>
                                    <span class="cont" v-html="item.data"></span>
                                </el-tooltip>
                                <span class="time">{{formatDate(item.occurTime)}}</span>
                            </div>
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
import {formatDate} from '@/utils'

export default {
    name: 'Index',
    components: {
        Process
    },
    data () {
        return {
            policys: [],
            announcements: [],
            questions: []
        }
    },
    created() {
        let id = localStorage.getItem('user')
        if (!id) {
            this.$router.replace('/login')
        }
        this.getPolicy()
        this.getAnnouncement()
        this.getQuestion()
    },
    methods: {
        formatDate,
        goRouter(path) {
            this.$router.push(path)
        },
        getPolicy() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getPolicy')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    limit: 5,
                    offset: 0
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.policys = res.body.data
                    }
                })
        },
        getQuestion() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getQuestion')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    limit: 5,
                    offset: 0
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.questions = res.body.data
                    }
                })
        },
        getAnnouncement() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getAnnouncement')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    limit: 6,
                    offset: 0
                })
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.announcements = res.body.data
                    }
                })
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
                    font-size: .14rem
                    .no-bulletin
                        font-size: .16rem
                        padding: .76rem 0
                        text-align: center
                    .entry
                        display: flex
                        cursor: pointer
                        border-bottom: 1px dotted #EBEEF5
                        .title
                            display: inline-block
                            flex: 0 0 auto
                            width: .7rem
                            font-weight: bold
                        .cont
                            display: inline-block
                            flex: 1 1 auto
                            overflow: hidden
                            text-overflow: ellipsis
                        .time
                            display: inline-block
                            flex: 0 0 auto
                            width: .8rem
    .footer
        position: fixed
        bottom: 0
        height: .6rem
        width: 100%
        background-color: rgb(84, 92, 100)
        line-height: .6rem
        color: #fff
</style>
