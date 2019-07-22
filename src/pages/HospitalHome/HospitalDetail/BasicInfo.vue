<template>
    <i-tab-pane label="基本信息" id="basic-info" name="basic-info">
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
            <i-form-item label="其它信息(包括医院的地址，公交位置等信息)">
                <i-input v-model="model.Address" type="textarea" />
            </i-form-item>
            <i-form-item>
                <i-button type="primary" @click="save()" :loading="loading">提交</i-button>
            </i-form-item>
        </i-form>
        <divider />
        <h3 class="hospital-abstract">医院概况</h3><span>（此信息由蜘蛛自动获取，无法编辑）</span>
        <span class="operate">上次同步时间：2019-5-6 19:11:11<i-button :loading="sync" @click="onSync">重新同步</i-button></span>
        <div class="hospital-abstract-detail" v-html="content">
        </div>
    </i-tab-pane>
</template>

<script>
let areas = require("./area.js").default;
let app = require("@/config");
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
        },
        value: {
            type: Object,
            required: true
        },
        article: {
            type: Object,
            default: null
        }
    },
    methods: {
        save () {
            let ID = this.id;
            let [Province, City, Area] = this.model.Location || ["", "", ""];
            this.loading = true;
            let params = {
                ID,
                Province,
                City,
                Area,
                ...this.model
            }
            axios.post("/api/hospital/SaveHospital", params, msg => {
                this.loading = false;
                if (msg.success) {
                    this.$Message.success("保存成功");
                } else {
                    this.$Message.warning(msg.msg);
                }
            })
        },
        onSync () {
            this.broadcast("HospitalDetail", "on-sync", true);
            axios.post("/api/hospital/GrabAbout", { id: this.id }, msg => {
                this.broadcast("HospitalDetail", "on-sync", false);
                console.log(msg);
                if (msg.success) {
                    this.$Message.success("抓取成功，刷新页面查看结果");
                    this.content = msg.About.Content;
                } else {
                    this.$Message.warning(msg.details.join(","));
                }
            })
        }
    },
    data () {
        return {
            model: this.value,
            dic: app.dictionary,
            loading: false,
            content: (this.article && this.article.Content) || '等待抓取',
            areas
        };
    },
    watch: {
        model: {
            deep: true,
            handler (v, ov) {
                this.$emit("input", v);
            }
        },
        article: {
            deep: true,
            handler (v, ov) {
                this.content = (v || { Content: "" }).Content
            }
        },
        value: {
            deep: true,
            handler (v) {
                this.model = v;
            }
        }
    }
}
</script>

<style lang="less">
#basic-info {
    width: 100%;
    padding: 5px;
    .hospital-abstract {
        margin-bottom: 16px;
        display: inline-block;
    }
    .hospital-abstract-detail {
        p {
            text-indent: 2em;
        }
    }
}
</style>
