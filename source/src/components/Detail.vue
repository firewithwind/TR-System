<template>
    <div class="detail">
        <requestion :requestion="requestion" :trip="trip" :inline="true" :isRemark="isRemark"></requestion>
    </div>
</template>
<script>
import Requestion from '@/components/Requestion'
import {query} from '@/utils'
export default {
    components: {
        Requestion
    },
    data() {
        return {
            requestion: {
                id: '12313122312',
                user: 'liulianxing',
                laboratory: '虚拟化技术研究室',
                project: '重点项目',
                state: 2
            },
            trip: {
                destination: '北京',
                description: '参加重点项目研究啊啊啊啊',
                way: 31,
                startTime: '1521105540920',
                endTime: '1521105541321',
                approver: ['yanjianen', 'zhangweigang']
            },
            isRemark: false
        }
    },
    created() {
        let step = location.href.split('?')
        let param = query(step[1])
        if (!!param.isRemark) {
            this.isRemark = true
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>
