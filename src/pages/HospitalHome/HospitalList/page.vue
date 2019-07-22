<template>
    <div id="hospital-list">
        <i-row class="searcher" type="flex">
            <i-col span="2" class="add-btn-area" v-if="permissions.add">
                <i-button size="large" type="primary" @click="goTo()">新建医院</i-button>
            </i-col>
            <i-col span="6">
                <i-input prefix="ios-search" size="large" placeholder="搜索医院名称" v-model="keyword" @keyup.enter.native="getData" />
            </i-col>
        </i-row>
        <i-divider />
        <i-table class="data-table" stripe :columns="columns" :data="data">
            <template slot-scope="{row}" slot="area">
                {{row.Province}}{{row.City}}
            </template>
            <template slot-scope="{row}" slot="action">
                <a href="javascript:;" @click="goTo(row.ID)">[修改]</a>
                <a href="javascript:;" @click="removeHospital(row.ID)" style="margin-left: 8px;" v-if="permissions.remove">[删除]</a>
            </template>
        </i-table>
        <Page v-if="totalPage > 1" :total="totalRow" ref="pager" :page="page" :page-size="pageSize" @on-change="pageChage" @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total/>
    </div>
</template>

<script>
let app = require("@/config");
let axios = require("axios");
export default {
    methods: {
        goTo (id) {
            this.$router.push({ name: "HospitalDetail", query: { id } });
        },
        getData () {
            let page = this.page;
            let pageSize = this.pageSize;
            let keyword = this.keyword;
            axios.post("/api/hospital/GetHospitals", { page, pageSize, keyword }, msg => {
                if (msg.success) {
                    this.data = msg.data;
                    this.totalRow = msg.totalRow;
                }
            })
        },
        removeHospital (id) {
            if (!confirm("是否确认删除医院")) {
                return;
            }
            axios.post("/api/hospital/RemoveHospital", { id }, msg => {
                if (msg.success) {
                    this.$Message.success("删除成功");
                    this.getData();
                }
            })
        }
    },
    data () {
        return {
            columns: [
                {
                    title: "医院名称",
                    key: "Name"
                },
                {
                    title: "医院等级",
                    key: "Level"
                },
                {
                    title: "医院地址",
                    slot: "area"
                },
                {
                    title: "医院属性",
                    key: "Attribute"
                },
                {
                    title: "排序号",
                    key: "DisplayOrder"
                },
                {
                    title: "操作",
                    slot: "action"
                }
            ],
            data: [],
            keyword: "",
            permissions: {
                add: app.checkPermission("Hospital.AddHospital"),
                remove: app.checkPermission("Hospital.RemoveHospital")
            },
            page: 1,
            pageSize: 10,
            totalRow: 0
        };
    },
    mounted () {
        app.title = "医院列表"
        this.getData();
    }
}
</script>

<style lang="less">

</style>
