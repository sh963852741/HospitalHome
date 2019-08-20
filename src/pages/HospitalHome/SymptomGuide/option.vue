<template>
    <div>
        <div class="option">
            <div><i-input v-model="model.DisplayOrder" /></div>
            <div><i-input v-model="model.Content" @keydown.native.enter="save()"/></div>
            <div>{{ dic["NodeType"][model.NextNodeType] }}</div>
            <div><i-switch v-model="model.IsDisplay" /></div>
            <div>
                <a class="btn" v-if="!isNew" href="javascript:;" @click="save()">[保存]</a>
                <a class="btn" v-if="isNew" href="javascript:;" @click="save()">[新建]</a>
                <a class="btn" v-if="!isNew && model.NextQuestionId !== guidEmpty" href="javascript:;" @click="toNext()">[前往下一问]</a>
                <a class="btn" v-if="!isNew && model.NextQuestionId === guidEmpty" href="javascript:;" @click="createNext()">[新建下一问]</a>
            </div>
        </div>
        <i-divider class="h-divider" />
    </div>
</template>

<script>
let app = require("@/config");
let axios = require("axios");
let guidEmpty = "00000000-0000-0000-0000-000000000000";
export default {
    props: {
        pId: {
            required: true
        },
        value: {
            default () {
                return {
                    ID: guidEmpty,
                    DisplayOrder: 0,
                    Content: "",
                    NextNodeType: 2,
                    IsDisplay: true,
                    NextQuestionId: guidEmpty,
                    SymptomQuestionId: guidEmpty
                };
            }
        }
    },
    methods: {
        toNext () {
            this.$router.push({ name: "SymptomGuide", query: { id: this.model.NextQuestionId } })
        },
        createNext () {
            let model = this.model;
            let oid = model.ID;
            axios.post("/api/hospital/CreateNextQuestion", { oid }, msg => {
                if (msg.success) {
                    this.$Message.success("保存成功")
                    this.$router.push({ name: "SymptomGuide", query: { id: msg.entity.ID } })
                } else {
                    this.$Message.warning(msg.msg || "加载错误")
                }
            })
        },
        save () {
            let model = this.model;
            if (!model.Content) {
                this.$Message.warning("必须填写内容")
                return;
            }

            axios.post("/api/hospital/SaveSymptomGuideOption", model, msg => {
                if (!msg.success) {
                    this.$Message.warning(msg.msg || "加载错误")
                } else {
                    if (this.isNew) {
                        this.model.Content = "";
                        this.$emit("create", msg.entity);
                    }
                    this.$Message.success("保存成功")
                }
            })
        }
    },
    data () {
        let model = this.value;
        model.SymptomQuestionId = this.pId;
        return {
            dic: app.dictionary,
            isNew: model.NextNodeType === 2,
            guidEmpty,
            model
        };
    }
}
</script>

<style lang="less">

</style>
