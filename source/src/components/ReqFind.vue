<template>
    <div class="find">
        <el-form :model="param" label-width=".8rem" :inline="true">
            <el-form-item label="用户">
                <el-input v-model="param.name"></el-input>
            </el-form-item>
            <el-form-item label="请求状态">
                <el-input v-model="param.state"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-input v-model="param.occurTime"></el-input>
            </el-form-item>
            <el-form-item label="所属项目">
                <el-input v-model="param.project"></el-input>
            </el-form-item>
            <el-button type="primary">查询</el-button>
        </el-form>
        <el-table :data="requestions">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="id"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="name"
                label="申请人">
            </el-table-column>
            <el-table-column
                prop="project"
                label="所属项目">
            </el-table-column>
            <el-table-column
                label="创建时间">
                <template slot-scope="scope">
                    {{formatDate(scope.row.occurTime)}}
                </template>
            </el-table-column>
            <el-table-column
                label="当前状态">
                <template slot-scope="scope">
                    {{stateEnum[scope.row.state]}}
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                label="描述">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="goForDetail(scope.row.id)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-wrapper">
            <el-pagination
            layout="prev, pager, next"
            :total="requestions.length">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {formatDate} from '@/utils'
export default {
    data() {
        return {
            param: {},
            requestions: []
        }
    },
    methods: {
        formatDate
    }
}
</script>
<style lang="stylus">
.find
    text-align: left
    .el-form-item
        width: 30%
    .page-wrapper
        margin-top: .15rem
        text-align: right
</style>
