<template>
    <i-card id="commits">
        <h3>{{hospitalName}}</h3>
        <div>
            <i-table class="data-table" stripe :data="data" :columns="columns">
                <template slot-scope="{row}" slot="CheckStatus">
                    {{dic[row.CheckStatus]}}
                </template>
                <template slot-scope="{row}" slot="Download">
                    <a class="btn" v-if="row.CSharpFileId!==empty" @click="download(row.CSharpFileId, hospitalName + '.cs')">[下载C#文件]</a>
                    <a class="btn" v-if="row.DllFileId!==empty" @click="download(row.DllFileId, hospitalName + '.dll')">[下载DLL]</a>
                    <a class="btn" v-if="row.DocumentFileId!==empty" @click="download(row.DocumentFileId, hospitalName + '.xlsx')">[下载文档]</a>
                </template>
                <template slot-scope="{row}" slot="Action">
                    <a v-if="row.CheckStatus !== 300" class="btn" :class="{ disabled: isloading }" @click="check(row.ID, 'ImportHospital')">[审核通过]</a>
                    <a v-if="row.CheckStatus !== 301" class="btn" :class="{ disabled: isloading }" @click="check(row.ID, 'SetUploadFail')">[不通过]</a>
                </template>
            </i-table>
        </div>
    </i-card>
</template>

<script>
let axios = require("axios");
let app = require("@/config");

export default {
    methods: {
        getData () {
            axios.post("/api/hospital/GetCodeHistories", { name: this.hospitalName }, msg => {
                if (msg.success) {
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
        return {
            hospitalName: this.$route.query.hospital,
            dic: app.dictionary["CodeCheckStatus"],
            columns: columns,
            empty: "00000000-0000-0000-0000-000000000000",
            data: [],
            isloading: false
        };
    },
    mounted () {
        app.title = `${this.hospitalName}的代码记录`;
        this.getData();
    }
}
</script>

<style lang="less">

</style>
