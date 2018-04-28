<template>
    <div class="statistic-param">
        <el-form :model="params" label-width=".7rem" :inline="true">
            <el-form-item v-if="$store.state.user && $store.state.user.level >0" label="申请人">
                <el-input v-model="params.id" placeholder="请输入用户ID" clearable></el-input>
            </el-form-item>
            <el-form-item label="研究室">
                <el-input v-model="params.laboratory" placeholder="请输入研究室名称"></el-input>
            </el-form-item>
            <el-form-item label="项目">
                <el-select v-model="params.project" clearable>
                    <el-option v-for="pro in projects" :key="pro.id" :label="pro.title" :value="pro.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="select-type">
                <el-radio v-model="type" :label="0">按年度</el-radio>
                <el-radio v-model="type" :label="1">按具体日期</el-radio>
            </el-form-item>
            <el-form-item label="起始时间">
                    <el-date-picker
                        v-show="type===0"
                        v-model="params.start"
                        type="year"
                        placeholder="起始年份"
                        value-format="timestamp">
                    </el-date-picker>
                    <el-date-picker
                        v-show="type!==0"
                        v-model="params.start"
                        placeholder="起始日期"
                        value-format="timestamp">
                    </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker
                    v-show="type===0"
                    v-model="params.end"
                    type="year"
                    placeholder="终止年份"
                    value-format="timestamp">
                </el-date-picker>
                <el-date-picker
                    v-show="type!==0"
                    v-model="params.end"
                    placeholder="结束日期"
                    value-format="timestamp">
                </el-date-picker>
            </el-form-item>
            <div class="submit">
                <el-button type="primary" @click="getStatisticDate">查询</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            params: {
                id: '',
                laboratory: '',
                project: '',
                start: '',
                end: '',
                type: 3
            },
            projects: [],
            type: 3
        }
    },
    created() {
        this.getProjects()
        this.getStatisticDate()
    },
    watch: {
        type: function(val, oldVal) {
            this.params.type = val
            this.params.start = this.params.end = ''
        }
    },
    methods: {
        getProjects() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getProjects')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.projects = res.body
                    }
                })
        },
        getStatisticDate() {
            let body = {...this.params}
            if (body.id === 'all') {
                body.id = ''
            }
            if (!body.start && !body.end) {
                body.end = new Date().setHours(0, 0, 0, 0)
                body.start = new Date(body.end).setMonth(new Date(body.end).getMonth() - 9)
                this.params.type = this.type = body.type = 3
            }
            if (!body.id) {
                body.id = this.$store.state.user.id || localStorage.user
            }
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getStatisticDate')
                .set('Authorization', 'Bearer ' + token)
                .send(body)
                .end((err, res) => {
                    if (!!err) {
                        this.$message({
                            type: 'error',
                            message: err.response.text
                        })
                    } else {
                        this.$emit('setData', res.body, body)
                    }
                })
        }
    }
}
</script>
<style lang="stylus">
.statistic-param
    .el-form
        width: 100%
        .el-form-item
            width: 100%
            margin-right: 0
            padding-left: .1rem
            .el-date-editor
                max-width: 90%
        .select-type
            text-align: center
        .submit
            text-align: center
</style>
