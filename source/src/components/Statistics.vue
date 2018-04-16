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
                    <el-menu-item index="bymonth">
                        <span slot="title">月份查询</span>
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
    }
}
</script>
<style lang="stylus" scoped>
.statistics
    .el-main
        margin-top: .2rem
</style>
