<template>
    <div class="question-detail">
        <h2 class="title">{{question.title}}</h2>
        <p class="time">创建时间：{{formatDate(question.occurTime)}}</p>
        <p class="content" v-html="question.data"></p>
    </div>
</template>
<script>
import {query, formatDate} from '@/utils'

export default {
    data() {
        return {
            question: {
                title: '',
                occurTime: '',
                data: ''
            }
        }
    },
    created() {
        let param = query(location.href.split('?')[1])
        if (!!param.id) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getQuestionDetail')
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
                        this.question = res.body
                    }
                })
        }
    },
    methods: {
        formatDate
    }
}
</script>
<style lang="stylus">
.question-detail
    .title
        font-size: .2rem
        font-weight: bold
    .time
        font-size: .1rem
    .content
        width: 70%
        margin: 0 auto 0
        padding-top: .1rem
        font-size: .14rem
        line-height: .2rem
        text-align: left
        border-top: 1px solid #F2F6FC
</style>
