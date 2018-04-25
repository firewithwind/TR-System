<template>
    <div class="detail">
        <requestion id="requestion" :requestion="requestion" :inline="true"></requestion>
        <reim-wrapper :requestion="requestion" :reims="reims" :pics="pics"></reim-wrapper>
    </div>
</template>
<script>
import Requestion from '@/components/Requestion'
import ReimWrapper from '@/components/ReimWrapper'
import {query, formatDate} from '@/utils'
import {feeTypesEnum} from '@/dataMap'

export default {
    components: {
        Requestion,
        ReimWrapper
    },
    data() {
        return {
            feeTypesEnum,
            requestion: {},
            reims: [],
            pics: []
        }
    },
    created() {
        let step = location.href.split('?')
        let param = query(step[1])
        if (!!param.isRemark) {
            this.isRemark = true
        }
        this.getRequestionDetail(param.id, this.getInvoices)
    },
    methods: {
        formatDate,
        getInvoices() {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getInvoices')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    requestion: this.requestion.id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.pics = res.body
                    }
                })
        },
        getRequestionDetail(id, callback = undefined) {
            let token = this.$store.state.token || (localStorage.getItem('token') && localStorage.getItem('token').slice(0, -5))
            this.$request
                .post('/test/getRequestionDetail')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.requestion = res.body
                        callback()
                    }
                })
            this.$request
                .post('/test/getReimbursements')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    id: id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.reims = res.body
                    }
                })
        }
    }
}
</script>
<style lang="stylus" scoped>
.detail
    text-algin: left
</style>
