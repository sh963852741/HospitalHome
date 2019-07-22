<template>
    <div id="hospital-detail">
        <i-spin fix v-if="spinShow" />
        <i-card class="hospital-desc">
            <i-row type="flex">
                <i-col class="logo">
                    <avatar-uploader :width="100" :height="100" :show-text="false" v-model="avatar" @input="saveAvatar" usage="imgHospitalAvatar" :id="id" single relate-table="Hospital" />
                </i-col>
                <i-col class="desc">
                    <h2 class="desc-title">{{ basicInfo.Name ? basicInfo.Name : "未命名" }}</h2>
                    <!-- <i-rate disabled :value="basicInfo.Stars" /> -->
                    <div>
                        <em class="desc-label">挂号电话:</em>
                        <span>{{basicInfo.RegisterTelephone}}</span>
                    </div>
                    <div>
                        <em class="desc-label">急诊电话:</em>
                        <span>{{basicInfo.EmergencyCall}}</span>
                    </div>
                </i-col>
            </i-row>
        </i-card>
        <i-row :gutter="20" style="margin-top: 20px;" type="flex">
            <i-col span="18">
                <i-card>
                    <i-tabs value="basic-info">
                        <basic-info :sync="syncLoading" :id="id" v-model="basicInfo" :article="article" />
                        <depart-info :sync="syncLoading" :id="id" />
                        <bid-info :sync="syncLoading" :id="id" />
                        <recruit-info :sync="syncLoading" :id="id" />
                        <spider-info :sync="syncLoading" :id="id" v-model="spiderInfo" />
                    </i-tabs>
                </i-card>
            </i-col>
            <i-col span="6">
                <i-card icon="ios-options" title="同步信息" :padding="0">
                    <i-cell-group>
                        <i-cell title="上次同步时间" label="2019-5-6 20:36:00" :disabled="syncLoading" @click.native="onSync()">
                            <span slot="extra" v-if="!syncLoading">
                                点此立刻同步
                            </span>
                            <span slot="extra" v-else>
                                <i-icon type="ios-loading ivu-load-loop" />正在同步中...
                            </span>
                        </i-cell>
                        <i-cell title="同步信息配置" extra="点此配置"/>
                        <i-cell title="同步开关">
                            <Switch :value="true" slot="extra" />
                        </i-cell>
                    </i-cell-group>
                </i-card>
            </i-col>
        </i-row>
    </div>
</template>

<script>
import basicInfo from './BasicInfo'
import departInfo from './DepartInfo'
import bidInfo from './BidInfo'
import recruitInfo from './RecruitInfo'
import spiderInfo from './SpiderInfo'
var app = require("@/config");
let axios = require("axios");
export default {
    name: "HospitalDetail",
    components: { basicInfo, departInfo, bidInfo, recruitInfo, spiderInfo },
    created () {
        this.$on("on-sync", msg => {
            this.syncLoading = msg;
        })
    },
    methods: {
        load () {
            let id = this.$route.query.id;
            axios.post("/api/hospital/GetHospital", { id }, msg => {
                console.log(msg);
                if (!msg.success) {
                    this.$Message.warning(msg.msg);
                    this.$router.push({name: "HospitalList"});
                    return;
                }
                this.id = msg.data.ID;
                this.avatar = msg.data.Avatar;
                this.basicInfo = msg.data.basicInfo;
                this.spiderInfo = msg.data.spiderInfo;
                this.article = msg.data.about;
                this.spinShow = false;
            })
        },
        saveAvatar (src) {
            axios.post("/api/hospital/SaveHospital", {
                ID: this.id,
                Avatar: this.avatar
            }, msg => {
                if (msg.success) {
                    this.$Message.success("成功切换图片");
                }
            })
        },
        onSync () {
            this.syncLoading = true;
        }
    },
    data () {
        return {
            spinShow: true,
            avatar: "",
            syncLoading: false,
            id: "",
            article: {},
            basicInfo: {},
            spiderInfo: {},
            permissions: {
                spider: app.checkPermission("Hospital.ManageSpider")
            }
        };
    },
    mounted () {
        app.title = "医院详细信息";
        this.load();
    }
}
</script>

<style lang="less">
#hospital-detail {
    .ivu-article {
        margin-bottom: 16px;
        border-bottom: #999 1px solid;
        .title {
            margin-bottom: 16px;
        }
        .desc {
            color: #000;
            text-indent: 2em;
            margin-bottom: 16px;
        }
        .news-info {
            color: #999;
            margin-bottom: 16px;
            .source {
                float: left;
                display: block;
            }
            .time {
                float: right;
                display: block;
            }
            &:after {
                content: ' ';
                display: block;
                clear: both;
                height:0;
                visibility:hidden;
            }
        }
    }
    .desc-title {
        display: inline-block;
        margin-bottom: 8px;
        margin-right: 16px;
    }
    .desc-label {
        font-style: normal;
        color: #bbb;
    }
    .operate {
        font-size: 0.8em;
        float: right;
        .ivu-btn {
            margin-left: 8px;
        }
    }
    .hospital-desc {
        padding: 20px 50px 26px;
        .logo {
            width: 100px;
            height: 100px;
        }
        .desc {
            padding-left: 60px;
        }
    }
}
</style>
