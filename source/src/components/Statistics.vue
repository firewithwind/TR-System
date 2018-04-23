<template>
    <div class="statistics">
        <el-container>
            <el-aside>
                <el-menu
                    :collapse="false"
                    :router="true"
                    default-active="create">
                    <el-menu-item index="byperson">
                        <span slot="title">个人查询</span>
                    </el-menu-item>
                    <el-menu-item index="byyear">
                        <span slot="title">年度查询</span>
                    </el-menu-item>
                    <el-menu-item index="byproject">
                        <span slot="title">项目查询</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    created() {
        if (!this.$store.state.user.id && !localStorage.user) {
            this.$router.replace('/login')
        }
    }
}
</script>
<style lang="stylus" scoped>
.statistics
    .el-aside
        position: fixed
        top: .61rem
        left: 0
    .el-main
        margin-left: 3rem
        margin-top: .2rem
</style>
