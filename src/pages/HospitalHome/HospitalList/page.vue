<template>
    <div id="hospital-list">
        <i-row class="advance-searcher">
            <i-col span="2" v-if="permissions.add">
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
            <i-col span="24">
                <i-button type="primary" @click="advSearch">搜索</i-button>
                <i-button @click="removeAllTags">清空</i-button>
            </i-col>
        </i-row>
        <i-row v-show="filters.length">
            <Icon type="ios-funnel" /> 检索项：
            <template v-for="(item, index) in filters">
                <i-tag :key="index" closable @on-close="removeTag(index)">{{item.display}}</i-tag>
            </template>
            <i-button type="text" size="small" @click="removeAllTags">清除所有</i-button>
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
var _ = require("lodash");
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
        removeTag (index) {
            let item = this.filters.splice(index, 1);
            switch (item[0].key) {
                case "keyword":
                    this.keyword = "";
                    break;
                default:
                    break;
            }
            this.getData();
        },
        advSearch () {
        },
        switchSearchMode () {
            this.display = !this.display;
        },
        goTo (id) {
            this.$router.push({ name: "HospitalDetail", query: { id } });
        },
        getData (page, filter) {
            let params = {
                page: page || this.page,
                pageSize: this.pageSize
            }
            this.filters.forEach(e => {
                if (!e.key || !e.value) {
                    return;
                }
                params[e.key] = e.value;
            });
            axios.post("/api/hospital/GetHospitals", params, msg => {
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
        },
        setKeyword: _.debounce(function () {
            let keyword = this.keyword;
            let f = this.filters.findIndex(e => e.key === "keyword");
            if (keyword) {
                let ele = {
                    key: "keyword",
                    display: `关键字：${keyword}`,
                    value: keyword
                }
                if (f > -1) {
                    this.filters[f] = ele;
                } else {
                    this.filters.push(ele);
                }
            } else {
                if (f > -1) {
                    this.filters.splice(f, 1);
                }
            }
            this.getData();
        }, 500)
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
            Displayorder: "",
            filters: []
        };
    },
    watch: {
    keyword (v) {
      this.setKeyword();
    }
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
    }
</style>
