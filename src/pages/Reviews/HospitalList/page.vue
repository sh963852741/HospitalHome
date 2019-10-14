<template>
    <i-card id="review-hospital-list">
        <i-row class="searcher" type="flex">
            <i-col span="2" class="add-btn-area">
                <i-button size="large" type="primary" @click="getData()"><i-icon type="md-refresh"></i-icon>刷新</i-button>
            </i-col>
            <i-col span="6">
                <i-input prefix="ios-search" size="large" placeholder="搜索医院名称" v-model="keyword" @keyup.enter.native="getData" />
            </i-col>
        </i-row>
        <i-row type="flex" class="filter-keywords" v-if="filters.length">
            <i-col span="2" class="title">
                <Icon type="ios-funnel" /> 检索项：
            </i-col>
            <i-col span="22">
                <template v-for="(item, index) in filters">
                    <i-tag :key="index" closable @on-close="removeTag(index)">{{item.display}}</i-tag>
                </template>
                <i-button type="text" size="small" @click="removeAllTags">清除所有</i-button>
            </i-col>
        </i-row>
        <i-divider />
        <i-table class="data-table" stripe :columns="columns" :data="data" ref="dataTable">
            <template slot-scope="{row}" slot="Name">
                <a href="javascript:;" @click="goTo(row.ID)">{{row.Name}}</a>
            </template>
            <template slot-scope="{row}" slot="status">
                {{ dicApprove[row.Status] }}
            </template>
            <template slot-scope="{row}" slot="importCheck">
                {{ dicCheck[row.Status] }}
            </template>
            <template slot-scope="{row}" slot="trailCheck">
                {{ dicCheck[row.Status] }}
            </template>
            <template slot-scope="{row}" slot="completeCheck">
                {{ dicCheck[row.Status] }}
            </template>
            <template slot-scope="{row}" slot="action">
                <a class="btn" href="javascript:;" @click="goTo(row.ID)">[审核]</a>
            </template>
        </i-table>
        <Page v-if="totalPage > 1" :total="totalRow" ref="pager" :current.sync="page" :page-size="pageSize" @on-change="pageChage" @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total/>
    </i-card>
</template>

<script>
let app = require("@/config");
let axios = require("axios");
var _ = require("lodash");

export default {
    methods: {
        goTo (id) {
            // let page = this.$route.name.indexOf("Final") > 0 ? "Final" : "Review";
            // this.$router.push({ name: `Hospital${page}Detail`, query: {id} });
            let page = this.$route.name.indexOf("Final") > 0 ? "final" : "reviews";
            window.open(`/manage/${page}/hospital?id=${id}`);
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
                    this.page = msg.page;
                    this.pageSize = msg.pageSize;
                    if (filter) {
                        let dt = this.$refs["dataTable"];
                        dt.handleFilterSelect(4, filter);
                    }
                }
            })
        },
        removeTag (index) {
            let item = this.filters.splice(index, 1);
            switch (item[0].key) {
                case "keyword":
                    this.keyword = "";
                    break;
                case "status":
                    let dt = this.$refs["dataTable"];
                    dt.handleFilterReset(4);
                    break;
                default:
                    break;
            }
            this.getData(1);
        },
        removeAllTags () {
            this.filters = [];
            this.keyword = "";
            let dt = this.$refs["dataTable"];
            dt.handleFilterReset(4);
            this.getData(1);
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
            this.getData(1);
        }, 500)
    },
    data () {
        let dicApprove = app.dictionary["ApproveStatus"];
        let ApproveStates = [];
        for (let index in dicApprove) {
            let item = dicApprove[index]
            ApproveStates.push({
                label: item,
                value: index,
                key: item
            });
        }

        let dicCheck = app.dictionary["CheckStatus"];
        let CheckStatus = [];
        for (let index in dicCheck) {
            let item = dicCheck[index]
            CheckStatus.push({
                label: item,
                value: index,
                key: item
            });
        }

        let THIS = this;
        return {
            columns: [
                {
                    slot: "Name",
                    title: "名称"
                },
                {
                    key: "Province",
                    title: "所在省"
                },
                {
                    key: "City",
                    title: "所在市"
                },
                {
                    key: "CreatedOn",
                    title: "录入时间"
                },
                {
                    slot: "status",
                    title: "审核状态",
                    filters: ApproveStates,
                    filterMultiple: false,
                    filterRemote (value, key, col) {
                        let v = value[0];
                        let f = THIS.filters.findIndex(e => e.key === "status");
                        if (f > -1) {
                            THIS.filters.splice(f, 1)
                        }
                        if (v) {
                            THIS.filters.push({
                                key: "status",
                                display: `审核状态：${dicApprove[v]}`,
                                value: v
                            });
                            THIS.getData(1);
                        }
                    }
                },
                {
                    slot: "action",
                    title: "操作"
                }
            ],
            filters: [],
            data: [],
            dicApprove,
            dicCheck,
            keyword: "",
            ApproveStates,
            CheckStatus,
            page: 1,
            pageSize: 10,
            totalRow: 0
        };
    },
    watch: {
        keyword (v) {
            this.setKeyword();
        },
        $route () {
            let audit = this.$route.name.indexOf("Final") > -1 ? 5 : 4;
            this.getData(1, audit);
        }
    },
    mounted () {
        app.title = "医院审核";
        let audit = this.$route.name.indexOf("Final") > -1 ? 5 : 4;
        this.getData(1, audit);
    }
}
</script>

<style lang="less">
@import "../../../assets/less/theme.less";
#review-hospital-list {
    .filter-keywords {
        margin-top: 24px;
        .title {
            width: 6em;
            text-align: right;
            color: @subsidiary-color;
        }
    }
}
</style>
