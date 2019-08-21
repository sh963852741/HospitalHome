<template>
    <i-row id="article-detail" :gutter="16">
        <i-col span="19">
            <i-card>
            </i-card>
        </i-col>
        <i-col span="5">
            <i-card title="基本信息">
                <i-form :model="article" :label-width="80">
                    <i-form-item label="所属分类">
                        <category-selector v-model="article.CategoryId" />
                    </i-form-item>
                    <i-form-item label="作者">
                        <i-input v-model="article.Author" />
                    </i-form-item>
                    <i-form-item label="发布时间">
                        <i-date-picker v-model="article.ReleaseTime" style="width: 100%;" />
                    </i-form-item>
                    <i-form-item label="关键字">
                        <i-input v-model="article.Keywords" />
                    </i-form-item>
                    <i-form-item label="摘要">
                        <i-input v-model="article.Abstract" type="textarea" />
                    </i-form-item>
                </i-form>
            </i-card>
            <i-card title="封面图片" class="mt20">
                <avatar-uploader :width="1920" :height="1080" :displayWidth="300" :displayHeight="170" usage="head-image" :needCrop="false" />
            </i-card>
        </i-col>
    </i-row>
</template>

<script>
let app = require("@/config");
export default {
    data () {
        return {
            article: {}
        };
    },
    mounted () {
        app.title = "新闻详细";
    }
}
</script>

<style lang="less">
#article-detail {
    margin: 0;
}
</style>
