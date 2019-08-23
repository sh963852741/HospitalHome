<template>
    <div id="hospital-list">
        <i-row class="advance-searcher" type="flex">
            <i-col span="2" class="add-btn-area" v-if="permissions.add">
                <i-button size="large" type="primary" @click="goTo()">新建医院</i-button>
            </i-col>
            <i-col span="9">
                <i-input prefix="ios-search" size="large" placeholder="搜索医院名称" v-model="keyword" @keyup.enter.native="getData" />
            </i-col>
          <i-col span="2" class="text">
            <i-button size="large" @click="switchSearchMode()" type="text">{{display?"普通搜索":"高级搜索"}}</i-button>
          </i-col>
        </i-row>
        <i-row v-show="display" type="flex">
            <i-col span="4">
                医院等级:
                <i-input v-model="level" />
            </i-col>
            <i-col span="1"/>
            <i-col span="4">
                医院地址：
                <i-input v-model="area"/>
            </i-col>
            <i-col span="1"/>
            <i-col span="4">
            医院属性:
            <i-input v-model="Attribute" />
            </i-col>
            <i-col span="1"/>
            <i-col span="4">
                排序号：
                <i-input v-model="Displayorder"/>
            </i-col>
        </i-row>
        <i-row v-show="display" class="advance-searcher">
                <i-col span="24" class="filter-btn-area">
                    <i-button type="primary" @click="advSearch">搜索</i-button>
                    <i-button @click="removeAllTags">清空</i-button>
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
        <Page v-if="totalPage > 1" :total="totalRow" ref="pager" :current.sync="page" :page-size="pageSize" @on-change="pageChage" @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total/>
    </div>
</template>

<script>
let app = require("@/config");
let axios = require("axios");
export default {
    methods: {
        removeAllTags () {
            this.keyword = "";
            this.area = "";
            this.Attribute = "";
            this.Displayorder = "";
            this.level = "";
            this.Name = "";
            this.getData();
        },
        advSearch () {
            // 参考getData
        },
        switchSearchMode () {
            if (this.display === false) {
            this.display = true;
            } else {
            this.display = false;
            }
        },
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
            totalRow: 0,
            display: false,
            searchType: "高级搜索",
            Name: "",
            level: "",
            area: "",
            Attribute: "",
            Displayorder: ""
        };
    },
    mounted () {
        app.title = "医院列表"
        this.getData();
    }
}
</script>

<style lang="less">
.text{
    font-size: 14px;
    word-spacing: 2px;
    line-height: 32px;
    text-align: center;
  }
  .advance-searcher {
        margin: 24px 0px;
        .filter-btn-area {
            margin-top: 16px;
        }
    }
</style>
