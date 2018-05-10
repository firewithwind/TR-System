<template>
    <div class="question">
        <div class="content">
            <ul class="wrapper">
                <div v-if="!questions.length" class="empty">没有数据哦~</div>
                <li v-for="(question, index) in questions" :key="question.id" @click="goDetail(question.id)"><span class="index">{{index + 1}}、</span><span>{{question.title}}</span></li>
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
export default {
    data() {
        return {
            questions: [],
            total: 0,
            limit: {
                limit: 20,
                offset: 0
            }
        }
    },
    mounted() {
        this.getquestion()
    },
    methods: {
        getQuestion() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getQuestion')
                .set('Authorization', `Bearer ${token}`)
                .send(this.limit)
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.questions = res.body.data
                        this.total = res.body.total
                    }
                })
        },
        goDetail(id) {
            this.$router.push(`/question/detail?id=${id}`)
        }
    }
}
</script>
<style lang="stylus" scoped>
.question
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
            li
                list-style: none
                border-bottom: 1px dotted #EBEEF5
                cursor: pointer
            .empty
                text-align: center
                font-size: .16rem
                margin-top: 1rem
</style>
