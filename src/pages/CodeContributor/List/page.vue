<template>
    <div id="contributor-list">
        <i-table class="data-table" stripe :columns="columns" :data="data">
            <template slot-scope="{row}" slot="name">
                <a href="javascript:;" @click="goTo(row.ID)">{{row.Name}}</a>
            </template>
            <template slot-scope="{row}" slot="limit">
                {{row.HospitalLimit == -1 ? "无限" : row.HospitalLimit}}
            </template>
            <template slot-scope="{row}" slot="action">
                <a href="javascript:;" @click="goTo(row.ID)">[详细]</a>
            </template>
        </i-table>
        <Page v-if="totalPage > 1" :total="totalRow" ref="pager" :page="page" :page-size="pageSize" @on-change="pageChage" @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total/>
    </div>
</template>

<script>
let app = require("@/config")
let axios = require("axios")
export default {
    methods: {
        goTo (id) {
            this.$router.push({ name: "MyCode", query: { id } });
        },
        getData () {
            let page = this.page;
            let pageSize = this.pageSize;
            axios.post("/api/hospital/GetContributor", { page, pageSize }, msg => {
                if (msg.success) {
                    this.data = msg.data;
                    this.totalRow = msg.totalRow;
                }
            })
        }
    },
    data () {
        return {
            columns: [
                {
                    slot: "name",
                    title: "组名"
                },
                {
                    slot: "limit",
                    title: "限制登记医院数"
                },
                {
                    slot: "action",
                    title: "操作"
                }
            ],
            data: [],
            page: 1,
            pageSize: 20,
            totalRow: 0
        };
    },
    mounted () {
        app.title = "医院科室设置";
        this.getData();
    }
}
</script>

<style lang="less">
</style>
