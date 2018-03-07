<template>
    <div class="reimbursement">
        <el-container>
            <el-aside>
                <el-menu
                    :collapse="false"
                    :router="true"
                    default-active="create">
                    <el-menu-item index="create">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-xinjian"></use>
                        </svg>
                        <span slot="title">新建申请</span>
                    </el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-daiban"></use>
                            </svg>
                            <span>我的待办</span>
                        </template>
                        <el-menu-item index="undone">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-order1"></use>
                            </svg>
                            <span>未完成申请</span>
                        </el-menu-item>
                        <el-menu-item index="unremark">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-dengdaishenpi"></use>
                            </svg>
                            <span>待审批申请</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item index="find">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-chaxun"></use>
                        </svg>
                        <span slot="title">查询申请</span>
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
        return {}
    }
}
</script>
<style lang="stylus" scoped>
.reimbursement
    height: 100%
    .icon
        width: .2rem
        height: .2rem
    .el-aside
        text-align: left
        text-indet: .4rem
</style>
