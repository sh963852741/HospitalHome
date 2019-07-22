<template>
    <i-tab-pane id="bid-info" name="bid-info" label="招投标信息">
        <h3 class="bid-title">&nbsp;</h3>
        <span class="operate">上次同步时间：2019-5-6 19:11:11<i-button :loading="sync" @click="onSync">重新同步</i-button></span>
        <h2 v-if="!data.length">暂无数据</h2>
        <template v-else>
            <router-link target="_blank" :to="{name: 'HospitalCms', query: { id: item.ID }}" class="ivu-article" v-for="(item, index) in data" :key="index">
                <h3 class="title">{{item.Topic}}</h3>
                <p class="desc" v-html="item.Abstract"></p>
                <div class="news-info">
                    <a class="source" :href="item.Source" target="_blank">
                        {{item.Author}}
                    </a>
                    <span class="time">
                        {{item.ReleaseTime}}
                    </span>
                </div>
                <i-divider />
            </router-link>
        </template>
    </i-tab-pane>
</template>

<script>
let axios = require("axios");
export default {
    props: {
        sync: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ""
        }
    },
    methods: {
        getData () {
            axios.post("/api/hospital/GetHospitalArticleList", { id: this.id, category: this.category }, msg => {
                if (msg.success) {
                    this.data = msg.data;
                    this.data.map(e => e.Abstract = e.Abstract.replace("\r", "").replace("\n", ""))
                    this.page = msg.page;
                    this.totalRow = msg.totalRow;
                    this.pageSize = msg.pageSize;
                }
            })
        },
        onSync () {
            this.broadcast("HospitalDetail", "on-sync", true);
            axios.post(this.api, { id: this.id }, msg => {
                this.broadcast("HospitalDetail", "on-sync", false);
                console.log(msg);
                if (msg.success) {
                    this.$Message.success("抓取成功，刷新页面查看结果");
                    this.getData();
                } else {
                    this.$Message.warning(msg.details.join(","));
                }
            })
        }
    },
    data () {
        return {
            category: "招投标信息",
            api: "/api/hospital/GrabBid",
            page: 1,
            pageSize: 10,
            totalRow: 0,
            data: [],
            loading: false
        };
    },
    watch: {
        id (v) {
            this.getData();
        }
    }
}
</script>

<style lang="less">
#bid-info {
    width: 100%;
    padding: 5px;
    .bid-title {
        margin-bottom: 16px;
        display: inline-block;
    }
}
</style>
