<template>
    <div class="index">
        <el-container>
            <el-aside>
                <el-menu
                  default-active="1"
                  class="el-menu-vertical-demo"
                  background-color="#545c64"
                  text-color="#fff"
                  active-text-color="#ffd04b"
                  :router="true">
                  <el-menu-item index="project" route="/manage/project">
                    <span slot="title">项目管理</span>
                  </el-menu-item>
                  <el-menu-item index="policy" route="/manage/policy">
                    <span slot="title">制度管理</span>
                  </el-menu-item>
                  <el-menu-item index="person" route="/manage/person">
                    <span slot="title">人员管理</span>
                  </el-menu-item>
                  <el-menu-item index="dictionary" route="/manage/dictionary">
                    <span slot="title">词典管理</span>
                  </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<script>

export default {
    name: 'index',
    data () {
        return {

        }
    },
    created() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.index
    .el-aside
        position: fixed
        top: 0
        left: 0
        bottom: 0
        background: #545c64
        border-right: 1px solid #545c64
        .el-menu
            border: none
    .el-main
        margin-left: 3rem
</style>
