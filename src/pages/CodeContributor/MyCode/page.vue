<template>
    <i-card id="my-code">
        <h3>{{name}}小组计分板</h3>
        <div class="score">
            <span class="plus30">（</span>
            <template v-for="(item, index) in score.baseScore">
                <span :key="index" class="f2">
                    <a class="text" :title="item.name">{{item.name}}</a>
                    <span class="num">{{item.score}}%</span>
                </span>
                <span class="plus30" :key="'p' + index" v-if="index < score.baseScore.length-1">+</span>
            </template>
            <span class="plus30">）</span>
            <span class="plus30" style="margin-left: -10px">×10</span>
            <span class="plus30">+</span>
            <span class="f2">
                <span class="text">附加分</span>
                <span class="num">{{score.extras}}</span>
            </span>
            <span class="plus30" style="margin-left: -1em">={{score.totalScore}}分</span>
        </div>
        <div>
            <i-table class="data-table" stripe :data="assign" :columns="columns">
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
                    key: "HospitalName",
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
