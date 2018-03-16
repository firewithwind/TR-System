<template>
    <div class="requestion">
        <requestion :requestion="requestion"></requestion>
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
                user: 'liulianxing',
                laboratory: '虚拟化技术研究室',
                state: 0
            }
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>
