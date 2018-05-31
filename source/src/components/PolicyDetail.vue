<template>
    <div class="policy-detail">
        <h2 class="title">{{policy.title}}</h2>
        <p class="time">创建时间：{{formatDate(policy.occurTime)}}</p>
        <p class="content" v-html="policy.data"></p>
        <div class="file-wrapper">
            <ul>
                <li v-for="(file, index) in fileList" :key="file.id" @click="handlePreview(file)" class="content">
                    附件{{index + 1}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {query, formatDate} from '@/utils'

export default {
    data() {
        return {
            policy: {
                title: '',
                occurTime: '',
                data: ''
            },
            fileList: []
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
        }
    },
    methods: {
        formatDate,
        handlePreview(file) {
            window.open(file.url)
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
        }
    }
}
</script>
<style lang="stylus">
.policy-detail
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
        overflow-x: auto
        table
            border-left: 1px solid #DCDFE6
            border-top: 1px solid #DCDFE6
            th, td
                border-right: 1px solid #DCDFE6
                border-bottom: 1px solid #DCDFE6
    .file-wrapper
        text-align: left
        width: 70%
        margin: .1rem auto
        ul
            margin: 0
            padding: 0
            li
                width: 100%
                list-style: none
                margin: 0
                padding: .03rem .02rem
                border: none
                border-radius: .02rem
                &:hover
                    background: #F2F6FC
                    color: #409EFF
                    cursor: pointer
</style>
