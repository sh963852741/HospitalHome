<template>
    <i-row id="symptom-guide" :gutter="20">
        <i-col span="18">
            <i-card title="配置问题">
                <i-form :model="model">
                    <i-form-item label="所提问题">
                        <i-input v-model="model.QuestionName" size="large" @on-change="saveEntity()"/>
                    </i-form-item>
                </i-form>
                <i-divider />
                <div>
                    <h3>选项表</h3>
                    <div class="option">
                        <div>排序号（降序）</div>
                        <div>选项内容</div>
                        <div>选项类型</div>
                        <div>是否显示</div>
                        <div>操作</div>
                    </div>
                    <i-divider class="h-divider" />
                    <div v-if="model.Options">
                        <template v-for="(item, index) in model.Options">
                            <opt :key="index" :value="item" :pId="model.ID" @create="newEntity" />
                        </template>
                        <opt :pId="model.ID" @create="newEntity" />
                    </div>
                </div>
            </i-card>
        </i-col>
        <i-col span="6">
            <i-card title="导诊记录">
                <i-timeline class="history">
                    <TimelineItem v-if="!parents.length">
                        <p class="topic">这是根节点</p>
                    </TimelineItem>
                    <TimelineItem v-for="(item, index) in parents" :key="index">
                        <a @click="toQuestion(item.QuestionId)" href="javascript:;" class="topic">问题：{{ item.QuestionName }}</a>
                        <p class="content">选择：{{ item.Content }}</p>
                    </TimelineItem>
                </i-timeline>
            </i-card>
        </i-col>
    </i-row>
</template>

<script>
import opt from "./option.vue"
let app = require("@/config");
let axios = require("axios");
let _ = require("lodash");
export default {
    components: { opt },
    methods: {
        toQuestion (id) {
            this.$router.push({ name: "SymptomGuide", query: { id } })
        },
        newEntity (entity) {
            this.model.Options.push(entity);
            console.log(entity);
        },
        getEntity () {
            axios.post("/api/hospital/GetSymptomGuideQuestion", { id: this.id }, msg => {
                if (!msg.success) {
                    this.$Message.warning(msg.msg || "加载错误")
                    return;
                }

                this.model = msg.entity;
                this.parents = msg.parents;
            })
        },
        saveEntity: _.debounce(function () {
            let ID = this.model.ID;
            let QuestionName = this.model.QuestionName.trim() || "";
            axios.post("/api/hospital/SaveSymptomGuideQuestion", { ID, QuestionName }, msg => {
                if (!msg.success) {
                    this.$Message.warning(msg.msg || "加载错误")
                } else {
                    this.$Message.success("保存成功")
                }
            })
        }, 500)
    },
    data () {
        let id = this.$route.query.id;
        return {
            id,
            model: {},
            parents: [],
            loading: false
        };
    },
    watch: {
        $route () {
            this.id = this.$route.query.id;
            this.model = {};
            this.parents = [];
            this.getEntity();
        }
    },
    mounted () {
        app.title = "智能导诊配置";
        this.getEntity();
    }
}
</script>

<style lang="less">
#symptom-guide {
    .option {
        display: flex;
        & > div {
            text-align: center;
            margin: 12px 0;
            &:nth-child(1) {
                flex: 1;
                .ivu-input {
                    width: 80%;
                    margin: 0 auto;
                }
            }
            &:nth-child(2) {
                flex: 3;
            }
            &:nth-child(3) {
                flex: 1;
            }
            &:nth-child(4) {
                flex: 1;
            }
            &:nth-child(5) {
                flex: 3;
            }
        }
    }
    .h-divider {
        margin: 0px;
    }
    .history {
        .topic {
            font-size: 14px;
            font-weight: bold;
        }
        .content {
            padding-left: 5px;
            margin-top: 10px;
        }
    }
}
</style>
