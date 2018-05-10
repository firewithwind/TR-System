<template>
    <div class="index">
        <el-container>
            <el-aside>
                <el-menu
                  default-active="1"
                  class="el-menu-vertical-demo"
                  :router="true">
                  <el-menu-item index="project" route="project">
                    <span slot="title">项目管理</span>
                  </el-menu-item>
                  <el-menu-item index="policy" route="policy">
                    <span slot="title">制度管理</span>
                  </el-menu-item>
                  <el-menu-item index="person" route="person">
                    <span slot="title">人员管理</span>
                  </el-menu-item>
                  <el-menu-item index="dictionary" route="dictionary">
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.index
    .el-aside
      position: fixed
      top: 0
      left: 0
      bottom: 0
</style>
