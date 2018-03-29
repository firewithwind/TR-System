<template>
    <div class="detail">
        <requestion :requestion="requestion" :inline="true"></requestion>
        <reim-wrapper :requestion="requestion" :reims="reims"></reim-wrapper>
    </div>
</template>
<script>
import Requestion from '@/components/Requestion'
import ReimWrapper from '@/components/ReimWrapper'
import {query} from '@/utils'

export default {
    components: {
        Requestion,
        ReimWrapper
    },
    data() {
        return {
            requestion: {},
            reims: []
        }
    },
    created() {
        let step = location.href.split('?')
        let param = query(step[1])
        if (!!param.isRemark) {
            this.isRemark = true
        }
        this.getRequestionDetail(param.id)
    },
    methods: {
        getRequestionDetail(id) {
            this.$request
                .post('/test/getRequestionDetail')
                .send({
                    id: id
                })
                .end((err, res) => {
                    if (!!err) {
                        console.log(err)
                    } else {
                        this.requestion = res.body
                    }
                })
            this.$request
                .post('/test/getReimbursements')
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
