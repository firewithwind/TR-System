<template>
    <div class="create-req">
        <requestion :requestion="requestion" @operateRequestion="createRequestion" :projects="projects"></requestion>
    </div>
</template>
<script>
import Requestion from '@/components/Requestion'
export default {
    components: {
        Requestion
    },
    data() {
        return {
            requestion: {
                user: '',
                name: '',
                laboratory: '',
                state: 0,
                dataRange: [],
                way: 30,
                destination: '',
                description: '',
                approver: []
            },
            projects: []
        }
    },
    created() {
        this.getProjects()
    },
    mounted() {
        this.setRequestion()
    },
    methods: {
        getProjects() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getProjects')
                .set('Authorization', `Bearer ${token}`)
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
        setRequestion() {
            if (!!this.$store.state.user.name) {
                this.requestion = {
                    user: this.$store.state.user && this.$store.state.user.id,
                    name: this.$store.state.user && this.$store.state.user.name,
                    laboratory: this.$store.state.user && this.$store.state.user.laboratory,
                    state: 0
                }
            } else {
                let token = this.$store.state.token || (localStorage.token && localStorage.token.slice(0, -5))
                if (!!token) {
                    this.$request
                        .post('/test/getUserInfor')
                        .set('Authorization', `Bearer ${token}`)
                        .set('accept', 'json')
                        .end((err, res) => {
                            if (!!err) {
                                if (err.status === 401) {
                                    this.$router.replace('/login')
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: err.response.text
                                    })
                                }
                                return
                            }
                            this.requestion = {
                                user: this.$store.state.user && this.$store.state.user.id,
                                name: this.$store.state.user && this.$store.state.user.name,
                                laboratory: this.$store.state.user && this.$store.state.user.laboratory,
                                state: 0
                            }
                            this.$store.commit('setUser', res.body)
                        })
                } else {
                    this.$router.replace('/login')
                }
            }
        },
        createRequestion(requestion) {
            let token = this.$store.state.token || (localStorage.token && localStorage.token.slice(0, -5))
            if (!this.requestion.name) {
                this.$message({
                    message: '发生错误，请刷新页面',
                    type: 'error'
                })
            } else if (!this.requestion.dataRange) {
                this.$message({
                    message: '请选择出差时间',
                    type: 'error'
                })
            } else if (!this.requestion.way) {
                this.$message({
                    message: '请选择交通工具',
                    type: 'error'
                })
            } else if (!this.requestion.destination) {
                this.$message({
                    message: '请输入出差的目的地',
                    type: 'error'
                })
            } else {
                this.$request
                    .post('/test/createRequestion')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        ...this.requestion,
                        startTime: new Date(this.requestion.dataRange[0]).getTime(),
                        endTime: new Date(this.requestion.dataRange[1]).getTime(),
                        dataRange: null
                    })
                    .set('accept', 'json')
                    .end((err, res) => {
                        if (!!err) {
                            if (err.status === 401) {
                                this.$router.push('/login')
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: err.response.text
                                })
                            }
                            return
                        }
                        if (res.status >= 200 && res.status < 300) {
                            this.$message({
                                type: 'success',
                                message: '新建申请单成功'
                            })
                            this.$router.push('/reimbursement/index/reqdetail?id=' + res.body.id)
                        }
                    })
            }
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>
