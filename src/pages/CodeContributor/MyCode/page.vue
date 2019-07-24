<template>
    <i-card id="my-code">
        <h3>{{name}} 提交的源代码</h3>
        <div>
            <i-table class="data-table" stripe :data="assign" :columns="columns">
                <template slot-scope="{row}" slot="HospitalName">
                    <router-link :to="{name: 'Commits', query: { hospital: row.HospitalName }}">{{row.HospitalName}}</router-link>
                </template>
                <template slot-scope="{row}" slot="Score">
                    {{row.Score}}%
                </template>
            </i-table>
        </div>
    </i-card>
</template>

<script>
let app = require("@/config")
let axios = require("axios")
export default {
    methods: {
        getData () {
            axios.post("/api/hospital/GetCodeUpload", { id: this.id }, msg => {
                if (msg.success) {
                    this.assign = msg.data.assign;
                    this.codes = msg.data.codes;
                    this.score = msg.data.score;
                    this.name = msg.data.Name;
                }
            })
        }
    },
    data () {
        let id = this.$route.query.id;
        return {
            id,
            name: "",
            assign: [],
            codes: [],
            score: {
                totalScore: 0,
                baseScore: [],
                extras: 0
            },
            columns: [
                {
                    slot: "HospitalName",
                    title: "登记医院名"
                },
                {
                    key: "Count",
                    title: "上传代码总数"
                },
                {
                    slot: "Score",
                    title: "平均完成率"
                },
                {
                    key: "UploadTime",
                    title: "上传时间"
                }
            ]
        };
    },
    mounted () {
        app.title = "查看我的代码";
        this.getData();
    }
}
</script>

<style lang="less">
#my-code {
    .score {
        margin: 16px 0px;
        .f30 {
            font-size: 50px;
            line-height: 54px;
        }
        .plus30 {
            font-size: 24px;
            line-height: 54px;
            margin: 0px 5px;
            display: inline-block;
        }
        .f2 {
            display: inline-block;
            .text {
                display: block;
                font-size: 14px;
                color: #657180;
                width: 5em;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .num {
                font-size: 24px;
            }
        }
    }
}
</style>
