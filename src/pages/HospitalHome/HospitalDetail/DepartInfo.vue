<template>
    <i-tab-pane label="科室设置" name="depart-info" class="depart-info" id="depart-info">
        <transition name="fade" mode="out-in" :duration="250">
            <i-row v-show="state==='list'" :gutter="16">
                <i-col span="24">
                    <h3 class="expert-list-title">科室列表</h3><span>（此信息由蜘蛛自动获取，无法编辑）</span>
                    <span class="operate">上次同步时间：2019-5-6 19:11:11<i-button :loading="sync" @click="onSync">重新同步</i-button></span>
                </i-col>
                <!-- <i-col span="12">
                    <i-button type="dashed" class="add-depart-btn" @click="toDetail">
                        <i-icon type="ios-add" />添加科室
                    </i-button>
                </i-col> -->
                <i-col span="12" v-for="item in departs" :key="item.ID">
                    <i-card @click.native="toDetail(item.ID)" class="depart-card">
                        <h2>{{item.Name}}</h2><!-- <span class="depart-member-count">(9人)</span> --><i-rate disabled :value="item.Rate" />
                        <divider />
                        <p v-if="item.Abstract" v-html="item.Abstract">
                        </p>
                        <p v-else>
                            暂无介绍
                        </p>
                        <div class="depart-tags">
                        </div>
                    </i-card>
                </i-col>
            </i-row>
        </transition>
        <transition name="fade" mode="out-in" :duration="250">
            <div class="depart-detail-form" v-show="state==='detail'">
                <i-form :model="model">
                    <i-form-item label="科室名称">
                        <i-input v-model="model.Name" />
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
                    <i-form-item label="标签">
                        <i-tag closable v-for="item in tags" :key="item" @on-close="removeTag(item)">{{item}}</i-tag>
                        <i-button icon="ios-add" type="dashed" size="small" @click="addTag()">添加标签</i-button>
                    </i-form-item>
                    <i-form-item>
                        <i-button type="primary" @click="save()" :loading="loading">提交</i-button>
                        <i-button @click="toList()">返回列表</i-button>
                    </i-form-item>
                </i-form>
                <divider />
                <i-row type="flex" :gutter="16">
                    <i-col span="12" v-for="item in experts" :key="item.ID">
                        <i-card class="expert-detail">
                            <div class="expert-wrapper">
                                <img :src="nopic" />
                                <div class="expert-infos">
                                    <h3 class="expert-name">{{item.Name}}</h3><span class="expert-tags">（{{item.Level}}）</span>
                                    <divider class="expert-divider" />
                                    <p class="expert-desc" v-html="item.Skill">
                                    </p>
                                </div>
                            </div>
                        </i-card>
                    </i-col>
                </i-row>
            </div>
        </transition>
    </i-tab-pane>
</template>

<script>
let axios = require("axios");
export default {
    props: {
        sync: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ""
        }
    },
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
        save () {
            let model = this.model;
            if (!model.Name) {
                this.$Message.warning("科室名不能为空");
                return;
            }

            model.Tags = this.tags.join(",");
            this.loading = true;

            axios.postStream("/api/hospital/SaveDepart", model, msg => {
                this.loading = false;
                if (msg.success) {
                    this.$Message.success(msg.msg || "保存成功");
                } else {
                    this.$Message.warning(msg.msg);
                }
            })
        },
        toDetail (id) {
            for (let dpt of this.departs) {
                if (dpt.ID === id) {
                    this.model = dpt;
                    break;
                }
            }
            this.experts = [];
            this.tags = [];
            this.state = "detail";
            this.tags = this.model.Tags.split(",").filter(e => e);
            axios.post("/api/hospital/GetExpertInfo", { id: this.model.ID, page: this.page, pageSize: this.pageSize }, msg => {
                if (msg.success) {
                    this.experts = msg.data;
                    this.page = msg.page;
                    this.totalRow = msg.totalRow;
                    this.pageSize = msg.pageSize;
                    document.body.scrollTop = 0
                    document.documentElement.scrollTop = 0
                }
            })
        },
        toList () {
            this.state = "list";
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        },
        getDepart () {
            this.state = "list";
            axios.post("/api/hospital/GetDepartInfo", { id: this.id, page: this.page, pageSize: this.pageSize }, msg => {
                if (msg.success) {
                    this.departs = msg.data;
                    this.page = msg.page;
                    this.totalRow = msg.totalRow;
                    this.pageSize = msg.pageSize;
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
        onSync () {
            if (!confirm("同步科室需要消耗大量时间，是否确认？")) {
                return;
            }
            this.broadcast("HospitalDetail", "on-sync", true);
            axios.post(this.api, { id: this.id }, msg => {
                this.broadcast("HospitalDetail", "on-sync", false);
                console.log(msg);
                if (msg.success) {
                    this.$Message.success("抓取成功，刷新页面查看结果");
                    this.getDepart();
                } else {
                    this.$Message.warning(msg.details.join(","));
                }
            })
        }
    },
    data () {
        return {
            state: "list",
            api: "/api/hospital/GrabDepart",
            page: 1,
            pageSize: 1000,
            totalRow: 0,
            departs: [],
            experts: [],
            standardDepart: [],
            tags: [],
            model: {},
            loading: false,
            nopic: require("../../../assets/images/no-pic.jpg")
        };
    },
    mounted () {
        this.getStandardDepart();
    },
    watch: {
        id (v) {
            this.getDepart();
        }
    }
}
</script>

<style lang="less">
#depart-info, .depart-info {
    .expert-detail {
        margin-bottom: 16px;
        .expert-wrapper {
            display: flex;
            .expert-desc {
                text-indent: 2em;
            }
            .expert-divider {
                margin: 8px 0;
            }
            .expert-infos {
                flex: 1;
                .expert-name {
                    display: inline-block;
                }
                .expert-tags {
                    font-style: normal;
                    color: #bbb;
                    font-size: 0.8em;
                }
            }
            img {
                width: 100px;
                height: 100px;
                margin-right: 16px;
            }
        }
    }
    .expert-list-title {
        margin-bottom: 16px;
        display: inline-block;
    }
    .depart-detail-form {
        width: 99%;
    }
    .add-depart-btn {
        display: block;
        width: 99%;
        height: 149px;
        font-size: 30px;
    }
    .depart-card {
        position: relative;
        cursor: pointer;
        margin-bottom: 16px;
        width: 99%;
        h2 {
            display: inline-block;
            margin-right: 8px;
        }
        .depart-member-count {
            font-size: 0.8em;
            display: inline-block;
            margin-right: 16px;
        }
        p {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space:nowrap
        }
    }
}
</style>
