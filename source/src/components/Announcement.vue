<template>
    <div class="announcement">
        <div class="content">
            <ul class="wrapper">
                <div v-if="!announcements.length" class="empty">没有数据哦~</div>
                <li class="entry" v-for="item in announcements" :key="item.id" @click="goRouter(item.url)">
                    <span class="title">{{item.title}}</span>
                    <el-tooltip class="item" effect="dark" placement="bottom">
                        <div slot="content" v-html="item.data"></div>
                        <span class="cont" v-html="item.data"></span>
                    </el-tooltip>
                    <span class="time">{{formatDate(item.occurTime)}}</span>
                </li>
            </ul>
            <el-pagination
                style="float: right"
                layout="prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {formatDate} from '@/utils'

export default {
    data() {
        return {
            announcements: [],
            total: 0,
            limit: {
                limit: 20,
                offset: 0
            }
        }
    },
    mounted() {
        this.getAnnouncement()
    },
    methods: {
        formatDate,
        goRouter(url) {
            this.$router.push(url)
        },
        getAnnouncement() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getAnnouncement')
                .set('Authorization', `Bearer ${token}`)
                .send(this.limit)
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.announcements = res.body.data
                        this.total = res.body.total
                    }
                })
        },
        goDetail(id) {
            this.$router.push(`/announcement/detail?id=${id}`)
        }
    }
}
</script>
<style lang="stylus" scoped>
.announcement
    display: flex
    justify-content: center
    .content
        width: 70%
        .wrapper
            min-height: 3rem
            font-size: .14rem
            padding: .1rem
            border: 1px solid #EBEEF5
            border-radius: .05rem
            box-sizing: border-box
            text-align: left
            .entry
                list-style: none
                border-bottom: 1px dotted #EBEEF5
                display: flex
                cursor: pointer
                .title
                    display: inline-block
                    flex: 0 0 auto
                    width: .7rem
                    font-weight: bold
                .cont
                    display: inline-block
                    flex: 1 1 auto
                .time
                    display: inline-block
                    flex: 0 0 auto
                    width: .8rem
            .empty
                text-align: center
                font-size: .16rem
                margin-top: 1rem
</style>
