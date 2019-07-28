<template>
    <i-row id="hospital-audit-detail" :gutter="20" type="flex">
        <i-col span="18">
            <i-card icon="ios-build" title="基本信息">
                <i-alert v-if="model.Source">
                    该部门的网址是：<a :href="model.Source" target="_blank">{{model.Source}}</a>
                </i-alert>
                <i-form :model="model">
                    <i-form-item label="科室名称">
                        <i-input v-model="model.Name" :disabled="true" />
                    </i-form-item>
                    <i-row type="flex">
                        <i-col span="12">
                            <i-form-item label="所属标准分类">
                                <i-select v-model="model.StandardCategoryId">
                                    <i-option value="00000000-0000-0000-0000-000000000000">无</i-option>
                                    <i-option v-for="item in standardDepart" :key="item.ID" :value="item.ID">{{item.Name}}</i-option>
                                </i-select>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item label="评分">
                                <div style="width: 100%; display: inline-block">
                                    <i-rate v-model="model.Rate" /> {{model.Rate}}星
                                </div>
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <i-form-item label="部门摘要">
                        <i-input v-model="model.Abstract" type="textarea" />
                    </i-form-item>
                    <i-alert show-icon>
                        <Icon type="ios-bulb-outline" slot="icon"></Icon>
                        特别提示
                        <template slot="desc">
                            如果这个部门不应该显示出来，比如这不是一个门诊部门。那么，就在标签里添加“<a href="javascript:;" @click="addTag('不显示')"><b>不显示</b></a>”三个字，或者点此链接即可。
                        </template>
                    </i-alert>
                    <i-form-item label="标签">
                        <i-tag closable v-for="item in tags" :key="item" @on-close="removeTag(item)">{{item}}</i-tag>
                        <i-button icon="ios-add" type="dashed" size="small" @click="addTag()">添加标签</i-button>
                    </i-form-item>
                    <i-form-item v-if="model.Status < 5 && permissions.review || model.Status == 5 && !permissions.final">
                        <i-button type="primary" :loading="loading" @click="saveReview(5)">复审通过</i-button>
                        <i-button  :loading="loading" @click="saveReview(2)">不通过</i-button>
                    </i-form-item>
                    <i-form-item v-if="(model.Status == 5 || model.Status == 6) && permissions.final">
                        <i-button type="primary" :loading="loading" @click="saveFinal(6)">终审通过</i-button>
                        <i-button :loading="loading" @click="saveFinal(2)">不通过</i-button>
                    </i-form-item>
                </i-form>
                <i-divider />
                <h3>部门详细介绍</h3>
                <div v-html="model.Description"></div>
            </i-card>
        </i-col>
        <i-col span="6">
            <i-card icon="ios-time" title="审核记录">
                <Timeline class="time-line">
                    <TimelineItem v-for="(item, index) in timeline" :key="index" :color="item.color">
                        <Icon :type="item.icon" slot="dot" />
                        <p class="topic">{{item.phrase}}{{item.text}}</p>
                        <p class="content" v-if="item.text === '已通过'">{{item.name}}于{{item.time}}审核</p>
                    </TimelineItem>
                </Timeline>
            </i-card>
        </i-col>
    </i-row>
</template>

<script>
let areas = require("../../HospitalHome/HospitalDetail/area.js").default;
let app = require("@/config");
let axios = require("axios");
export default {
    methods: {
        addTag (str) {
            let tag = str || prompt("请输入标签");
            if (tag && this.tags.indexOf(tag) < 0) {
                this.tags.push(tag);
            }
        },
        removeTag (tag) {
            let index = this.tags.indexOf(tag);
            if (index > -1) {
                this.tags.splice(index, 1);
            }
        },
        load () {
            axios.post("/api/hospital/GetBasicDepart", { id: this.id }, msg => {
                if (!msg.success) {
                    this.$Message.warning("找不到部门");
                    this.$router.go(-1);
                } else {
                    let model = msg.data;
                    model.Location = [ model.Province, model.City, model.Area ];
                    let toIcon = status => {
                        switch (status) {
                            case 1:
                                return ["ios-checkmark-circle", "已通过", "green"];
                            case 2:
                                return ["ios-close-circle", "未通过", "red"];
                            default:
                                return ["md-information-circle", "未开始", "blue"];
                        }
                    }
                    let [importIcon, importText, importColor] = toIcon(model.ImportApproveStatus);
                    let [reviewIcon, reviewText, reviewColor] = toIcon(model.TrailStatus);
                    let [finalIcon, finalText, finalColor] = toIcon(model.CompleteStatus);
                    let timeline = [
                        {
                            phrase: "初审",
                            icon: importIcon,
                            name: model.ImportAuditor,
                            text: importText,
                            color: importColor,
                            time: model.ImportApproveTime
                        },
                        {
                            phrase: "复审",
                            icon: reviewIcon,
                            name: model.TrailAuditor,
                            text: reviewText,
                            color: reviewColor,
                            time: model.TrailTime
                        },
                        {
                            phrase: "终审",
                            icon: finalIcon,
                            name: model.CompleteAuditor,
                            text: finalText,
                            color: finalColor,
                            time: model.CompleteTime
                        }
                    ]
                    this.model = msg.data;
                    this.tags = this.model.Tags.split(",").filter(e => e);
                    this.timeline = timeline;
                }
            })
        },
        getStandardDepart () {
            axios.post("/api/hospital/GetStandardDeparts", { id: this.id, page: 1, pageSize: 1000 }, msg => {
                if (msg.success) {
                    this.standardDepart = msg.data;
                }
            })
        },
        saveReview (status) {
            let model = { ...this.model };
            model.Status = status;
            model.Tags = this.tags.join(",");
            this.loading = true;
            axios.postStream("/api/hospital/SaveReviewDepart", model, msg => {
                this.loading = false;
                if (msg.success) {
                    this.$Message.success(msg.msg || "保存成功");
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.load();
            })
        },
        saveFinal (status) {
            let model = { ...this.model };
            model.Status = status;
            model.Tags = this.tags.join(",");
            this.loading = true;
            axios.postStream("/api/hospital/SaveFinalDepart", model, msg => {
                this.loading = false;
                if (msg.success) {
                    this.$Message.success(msg.msg || "保存成功");
                } else {
                    this.$Message.warning(msg.msg);
                }
                this.load();
            })
        }
    },
    data () {
        let audit = this.$route.name.indexOf("Final") > -1 ? "final" : "review";
        let id = this.$route.query.id;
        return {
            id,
            model: {},
            areas,
            audit,
            dic: app.dictionary,
            permissions: {
                review: app.checkPermission("Hospital.ReviewAuditor"),
                final: app.checkPermission("Hospital.FinalAuditor")
            },
            tags: [],
            timeline: [],
            standardDepart: [],
            loading: false
        };
    },
    mounted () {
        this.getStandardDepart();
        let p = "部门";
        app.title = this.audit === "final" ? p + "终审" : p + "复审";
        this.load();
    }
}
</script>

<style lang="less">
#hospital-audit-detail {
    .time-line {
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
