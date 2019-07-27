<template>
    <i-row id="hospital-audit-detail" :gutter="20" type="flex">
        <i-col span="18">
            <i-card icon="ios-build" title="基本信息">
                <i-alert v-if="model.Source">
                    医院的网址是：<a :href="model.Source" target="_blank">{{model.Source}}</a>
                </i-alert>
                <i-form :model="model">
                    <i-form-item label="医院名称">
                        <i-input v-model="model.Name" />
                    </i-form-item>
                    <i-row :gutter="16">
                        <i-col span="12">
                            <i-form-item label="医院等级">
                                <i-select filterable v-model="model.Level">
                                    <i-option v-for="(item, index) in dic['医院等级']" :key="index" :value="index">{{item}}</i-option>
                                </i-select>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item label="医院属性">
                                <i-select filterable v-model="model.Attribute">
                                    <i-option v-for="(item, index) in dic['医院属性']" :key="index" :value="index">{{item}}</i-option>
                                </i-select>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item label="医院所属">
                                <i-select filterable v-model="model.Belong">
                                    <i-option v-for="(item, index) in dic['医院所属']" :key="index" :value="index">{{item}}</i-option>
                                </i-select>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item label="盈利模式">
                                <i-select filterable v-model="model.ProfitModel">
                                    <i-option v-for="(item, index) in dic['盈利模式']" :key="index" :value="index">{{item}}</i-option>
                                </i-select>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item label="门诊预约电话">
                                <i-input v-model="model.RegisterTelephone" />
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item label="急诊联系电话">
                                <i-input v-model="model.EmergencyCall" />
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item label="医院所在地区">
                                <i-cascader :data="areas" v-model="model.Location"/>
                            </i-form-item>
                        </i-col>
                        <i-col span="12">
                            <i-form-item label="排序号（降序）">
                                <i-input v-model="model.DisplayOrder" />
                            </i-form-item>
                        </i-col>
                    </i-row>
                    <i-form-item label="标签">
                        <i-tag closable v-for="item in tags" :key="item" @on-close="removeTag(item)">{{item}}</i-tag>
                        <i-button icon="ios-add" type="dashed" size="small" @click="addTag()">添加标签</i-button>
                    </i-form-item>
                    <i-form-item label="其它信息(包括医院的地址，公交位置等信息)">
                        <i-input v-model="model.Address" type="textarea" />
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
        addTag () {
            let tag = prompt("请输入标签");
            if (tag) {
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
            axios.post("/api/hospital/GetBasicHospital", { id: this.id }, msg => {
                if (!msg.success) {
                    this.$Message.warning("找不到医院");
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
        saveReview (status) {
            let model = { ...this.model };
            model.Status = status;
            model.Tags = this.tags.join(",");
            this.loading = true;
            axios.postStream("/api/hospital/SaveReviewHospital", model, msg => {
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
            axios.postStream("/api/hospital/SaveFinalHospital", model, msg => {
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
            loading: false
        };
    },
    mounted () {
        let p = "医院";
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
