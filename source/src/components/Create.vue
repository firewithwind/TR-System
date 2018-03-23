<template>
    <div class="requestion">
        <requestion :requestion="requestion" @operateRequestion="createRequestion"></requestion>
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
                laboratory: '',
                state: 0,
                dataRange: [],
                way: 30,
                destination: '',
                description: '',
                approver: []
            }
        }
    },
    mounted() {
        this.setRequestion()
    },
    methods: {
        setRequestion() {
            if (!!this.$store.state.user.name) {
                this.requestion = {
                    user: this.$store.state.user && this.$store.state.user.name,
                    laboratory: this.$store.state.user && this.$store.state.user.laboratory,
                    state: 0
                }
            } else {
                let id = localStorage.getItem('user')
                if (!!id) {
                    this.$request
                        .post('/test/getUserInfor')
                        .send({
                            id: id
                        })
                        .set('accept', 'json')
                        .end((err, res) => {
                            if (!!err) {
                                console.log(err)
                                return
                            }
                            this.requestion = {
                                user: this.$store.state.user && this.$store.state.user.name,
                                laboratory: this.$store.state.user && this.$store.state.user.laboratory,
                                state: 0
                            }
                            this.$store.commit('setUser', res.body)
                        })
                } else {
                    localStorage.setItem('user', '00000001')
                }
            }
        },
        createRequestion(requestion, trip) {
            this.$request
                .post('/test/createRequestion')
                .send({
                    ...requestion,
                    requester: this.$store.state.user.id,
                    startTime: new Date(requestion.dataRange[0]).getTime(),
                    endTime: new Date(requestion.dataRange[1]).getTime(),
                    dataRange: null
                })
                .set('accept', 'json')
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                        return
                    }
                    if (res.status >= 200 && res.status < 300) {
                        this.$message({
                            type: 'success',
                            message: '新建申请单成功'
                        })
                        this.$router.push('/reimbursement/index/detail?id=' + res.body.id)
                    }
                })
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>
