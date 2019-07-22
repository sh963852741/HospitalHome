<template>
    <i-card id="hospital-cms" class="center">
        <h3>{{topic}}</h3>
        <div>
            <span>发布日期：{{time}}</span>
            <span>作者：<a target="_blank" :href="source">{{author}}（点击查看原文）</a></span>
        </div>
        <divider />
        <div v-html="content"></div>
    </i-card>
</template>

<script>
let axios = require("axios");
let app = require("@/config")
export default {
    methods: {
        getData () {
            let id = this.$route.query.id;
            axios.post("/api/hospital/GetHospitalArticle", {id}, msg => {
                if (msg.success) {
                    this.topic = msg.data.Topic;
                    app.title = this.topic;
                    this.author = msg.data.Author;
                    this.source = msg.data.Source;
                    this.time = msg.data.ReleaseTime
                    this.content = msg.data.Content;
                }
            })
        }
    },
    data () {
        return {
            topic: "",
            author: "",
            source: "",
            time: "",
            content: ""
        }
    },
    mounted () {
        app.title = "";
        this.getData();
    }
}
</script>

<style lang="less">
#hospital-cms {
    margin: 0 auto;
}
</style>
