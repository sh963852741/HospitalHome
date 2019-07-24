<template>
    <i-card id="import-auditor">
        <i-row class="searcher" type="flex">
            <i-col span="6">
                <i-input prefix="ios-search" size="large" placeholder="搜索医院名称" v-model="name" @keyup.enter.native="getData(1)" />
            </i-col>
            <i-col span="8" class="ml10">
                <i-select multiple size="large" v-model="status" @on-change="getData(1)">
                    <i-option v-for="item in options" :key="item.key" :value="item.key">{{item.value}}</i-option>
                </i-select>
            </i-col>
        </i-row>
        <i-divider />
        <div>
            <i-table class="data-table" stripe :data="data" :columns="columns">
                <template slot-scope="{row}" slot="CheckStatus">
                    {{dic[row.CheckStatus]}}
                </template>
                <template slot-scope="{row}" slot="Download">
                    <a class="btn" v-if="row.CSharpFileId!==empty" @click="download(row.CSharpFileId, row.HospitalName + '.cs')">[下载C#文件]</a>
                    <a class="btn" v-if="row.DllFileId!==empty" @click="download(row.DllFileId, row.HospitalName + '.dll')">[下载DLL]</a>
                    <a class="btn" v-if="row.DocumentFileId!==empty" @click="download(row.DocumentFileId, row.HospitalName + '.xlsx')">[下载文档]</a>
                </template>
                <template slot-scope="{row}" slot="Action">
                    <a v-if="row.CheckStatus !== 300" class="btn" :class="{ disabled: isloading }" @click="check(row.ID, 'ImportHospital')">[审核通过]</a>
                    <a v-if="row.CheckStatus !== 301" class="btn" :class="{ disabled: isloading }" @click="check(row.ID, 'SetUploadFail')">[不通过]</a>
                </template>
            </i-table>
            <Page v-if="totalPage > 1" :total="totalRow" ref="pager" :page="page" :page-size="pageSize" @on-change="pageChage" @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total/>
        </div>
    </i-card>
</template>

<script>
let axios = require("axios");
let app = require("@/config");

export default {
    methods: {
        getData (pg) {
            let page = pg || this.page;
            let pageSize = this.pageSize;
            let name = this.name;
            let status = this.status;
            axios.post("/api/hospital/GetNeedImport", { page, pageSize, name, status: status.join(',') }, msg => {
                if (msg.success) {
                    this.data = msg.data;
                    this.totalRow = msg.totalRow;
                    this.data = msg.data;
                }
            })
        },
        download (id, name) {
            window.open(`/api/hospital/Download?id=${id}&file=${name}`)
        },
        check (id, api) {
            if (this.isloading) return;

            if (!confirm("是否确定审核记录？")) {
                return;
            }

            let loading = this.$Message.loading({
                content: "提交中，请稍候...",
                duration: 0
            });
            this.isloading = true;
            axios.post(`/api/hospital/${api}`, { id }, msg => {
                this.isloading = false;
                if (msg.success) {
                    this.$Message.success("操作成功！");
                    loading();
                    this.getData();
                } else {
                    this.$Message.warn(msg.msg);
                }
            })
        }
    },
    data () {
        let columns = [
            {
                key: "HospitalName",
                title: "医院名称"
            },
            {
                key: "UploadTime",
                title: "上传时间"
            },
            {
                slot: "CheckStatus",
                title: "代码状态"
            },
            {
                slot: "Download",
                title: "下载内容"
            }
        ];
        app.checkPermission("Hospital.ImportAuditor") && columns.push({
            slot: "Action",
            title: "操作"
        });

        let dic = app.dictionary["源码审核状态"];
        let options = [];
        for (let index in dic) {
            let el = dic[index];
            options.push({
                key: index,
                value: el
            });
        }
        console.log(options);
        return {
            dic,
            options,
            columns: columns,
            empty: "00000000-0000-0000-0000-000000000000",
            data: [],
            isloading: false,
            name: "",
            status: [],
            page: 1,
            pageSize: 20,
            totalRow: 0
        };
    },
    mounted () {
        app.title = `审核提交的代码`;
        this.getData();
    }
}
</script>

<style lang="less">
</style>
