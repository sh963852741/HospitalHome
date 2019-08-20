<template>
    <i-row id="hospital-audit-detail" :gutter="20" type="flex">
        <i-col span="18">
            <i-card icon="ios-build" title="基本信息">
                <i-alert v-if="model.Source">
                    该专家对应的链接是：<a :href="model.Source" target="_blank">{{model.Source}}</a>
                </i-alert>
                <i-form :model="model">
                    <i-form-item label="专家名称">
                        <i-input v-model="model.Name" :disabled="true" />
                    </i-form-item>
                    <i-form-item label="专家职称">
                        <i-input v-model="model.Level" />
                    </i-form-item>
                    <i-form-item label="专家专长">
                        <i-input v-model="model.Skill" />
                    </i-form-item>
                    <i-form-item label="出诊时间">
                        <div>
                            <i-checkbox v-for="(item, index) in week" :key="index" v-model="weekValues[item + '上午']"
                             @on-change="onChange(item + '上午', $event)">{{item}}上午</i-checkbox>
                        </div>
                        <div>
                            <i-checkbox v-for="(item, index) in week" :key="index" v-model="weekValues[item + '下午']"
                             @on-change="onChange(item + '下午', $event)">{{item}}下午</i-checkbox>
                        </div>
                    </i-form-item>
                    <i-alert show-icon>
                        <Icon type="ios-bulb-outline" slot="icon"></Icon>
                        特别提示
                        <template slot="desc">
                            如果该专家不应该显示出来。那么，就在标签里添加“<a href="javascript:;" @click="addTag('不显示')"><b>不显示</b></a>”三个字，或者点此链接即可。
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
                <h3>专家详细介绍</h3>
                <div v-html="model.Abstract"></div>
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
        onChange (str, ev) {
            let func = ev ? this.addSchedule : this.removeSchedule;
            func(str);
        },
        addSchedule (str) {
            if (str && this.schedules.indexOf(str) < 0) {
                this.schedules.push(str);
            }
        },
        removeSchedule (str) {
            let index = this.schedules.indexOf(str);
            if (index > -1) {
                this.schedules.splice(index, 1);
            }
        },
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
            axios.post("/api/hospital/GetBasicExpert", { id: this.id }, msg => {
                if (!msg.success) {
                    this.$Message.warning("找不到专家");
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
                    this.schedules = this.model.Schedule.split(",").filter(e => e);
                    this.schedules.forEach(e => this.weekValues[e] = true);
                    this.timeline = timeline;
                }
            })
        },
        saveReview (status) {
            let model = { ...this.model };
            let schedule = this.schedules.join(",");
            model.Status = status;
            model.Tags = this.tags.join(",");
            model.Schedule = schedule;
            this.loading = true;
            axios.postStream("/api/hospital/SaveReviewExpert", model, msg => {
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
            let schedule = this.schedules.join(",");
            model.Status = status;
            model.Tags = this.tags.join(",");
            model.Schedule = schedule;
            this.loading = true;
            axios.postStream("/api/hospital/SaveFinalExpert", model, msg => {
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
        let week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        let weekValues = {};
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
            week,
            schedules: [],
            weekValues,
            loading: false
        };
    },
    mounted () {
        let p = "专家";
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
