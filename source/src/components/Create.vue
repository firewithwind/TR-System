<template>
    <div class="create">
        <el-form v-model="requestion" label-width="0.8rem">
            <el-form-item label="申请人">
                <el-input v-model="requestion.user" disabled>{{requestion.user}}</el-input>
            </el-form-item>
            <el-form-item label="实验室">
                <el-input v-model="requestion.laboratory" disabled>{{requestion.laboratory}}</el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            requestion: {
                user: 'liulianxing',
                laboratory: '网络安全实验室'
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
.create
    font-size: .18rem
</style>
