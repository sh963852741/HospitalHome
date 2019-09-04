<template>
    <i-card id="hospital-depart-manager">
        <i-row class="searcher" type="flex">
            <i-col span="2" class="add-btn-area">
                <i-button type="primary" size="large" @click="addModel()" >添加科室</i-button>
            </i-col>
            <i-col span="6">
                <i-input prefix="ios-search" size="large" placeholder="按名称查询" v-model="name" @keyup.enter.native="getData" />
            </i-col>
        </i-row>
        <i-divider />
        <i-table :data="data" :columns="columns" @on-filter-change="onFilterChange">
            <template slot-scope="{ row }" slot="OtherNames">
                <span v-if="!row.other || !row.other.length || !row.other[0]">无</span>
                <i-tag v-else v-for="item in row.other" :key="item">{{item}}</i-tag>
            </template>
            <template slot-scope="{ row }" slot="Diseases">
                <span v-if="!row.disease || !row.disease.length || !row.disease[0]">无</span>
                <i-tag v-else v-for="item in row.disease" :key="item">{{item}}</i-tag>
            </template>
            <template slot-scope="{ row }" slot="Symptoms">
                <span v-if="!row.symptoms || !row.symptoms.length || !row.symptoms[0]">无</span>
                <i-tag v-else v-for="item in row.symptoms" :key="item">{{item}}</i-tag>
            </template>
            <template slot-scope="{ row }" slot="action">
                <a href="javascript:;" @click="addModel({
                    ID: row.ID,
                    Name: row.Name,
                    OtherNames: row.OtherNames,
                    Diseases: row.Diseases,
                    Sort: row.Sort
                })">[修改]</a>
                <a href="javascript:;" @click="remove(row.ID)">[删除]</a>
            </template>
        </i-table>
        <i-modal title="添加/编辑医院科室" v-model="showDialog" :mask-closable="false" :width="900">
            <i-form ref="form" :model="model" :label-width="100" :rules="rules">
                <i-form-item label="科室名" prop="Name">
                    <i-input v-model="model.Name" />
                </i-form-item>
                <i-form-item label="科室别名" prop="OtherNames">
                    <i-input v-model="model.OtherNames" type="textarea" :autosize="{minRows: 1,maxRows: 5}"/>
                    <p>科室别名用以<b>抓取时</b>的识别，例如该字段设置为“心内科，心血管内科”，则如果抓取时医院的科室名为“心内科”系统会将其识别为这个科室。每个别名使用逗号或回车隔开。</p>
                </i-form-item>
                <i-form-item label="搜索关键字" prop="Diseases">
                    <i-input v-model="model.Diseases" type="textarea" :autosize="{minRows: 1,maxRows: 5}"/>
                    <p>搜索关键字用以<b>用户搜索</b>的识别，例如该字段设置为“感冒，发烧”，则如果用户搜索“感冒”则会找到这个科室。每个关键字使用逗号或回车隔开。</p>
                </i-form-item>
                <i-form-item label="可处理症状" prop="Diseases">
                    <i-input v-model="model.Symptoms" type="textarea" :autosize="{minRows: 1,maxRows: 5}"/>
                    <p>搜索关键字用以<b>用户搜索</b>的识别，例如该字段设置为“感冒，发烧”，则如果用户搜索“感冒”则会找到这个科室。每个关键字使用逗号或回车隔开。</p>
                </i-form-item>
                <i-form-item label="排序号" prop="Sort">
                    <i-input-number v-model="model.Sort" />
                    <p>显示时，以排序号<b>降序</b>排列。</p>
                </i-form-item>
            </i-form>
            <div slot="footer">
                <Button type="primary" :loading="isloading" @click="confirm()" >确认</Button>
                <Button @click="showDialog=false" >取消</Button>
            </div>
        </i-modal>
    </i-card>
</template>

<script>
let app = require("@/config")
let axios = require("axios");
export default {
    methods: {
        addModel (model) {
            let flag = !model;
            this.model = model || {
                Name: "",
                OtherNames: "",
                Diseases: "",
                Sort: 1
            };
            let form = this.$refs["form"];
            flag && form.resetFields();
            this.showDialog = true;
        },
        confirm () {
            this.isloading = true;
            let form = this.$refs["form"];
            form.validate(v => {
                if (!v) {
                    this.isloading = false;
                    return;
                }

                axios.post("/api/hospital/SaveHospitalDepart", this.model, msg => {
                    this.isloading = false;
                    this.showDialog = false;
                    this.getData();
                })
            });
        },
        getData () {
            let page = 1;
            let pageSize = 1000;
            let name = this.name;
            // let other = this.other;
            // let keyword = this.keyword;
            axios.post("/api/hospital/GetHospitalDeparts", { page, pageSize, name }, msg => {
                let data = msg.data;
                data.map(e => {
                    e.other = e.OtherNames.split(",");
                    e.disease = e.Diseases.split(",");
                    e.symptoms = e.Symptoms ? e.Symptoms.split(",") : false;
                });
                this.data = data;
                this.columns[1].filters = msg.filters.others.map(e => {
                    return { label: e, value: e };
                });
                this.columns[2].filters = msg.filters.keys.map(e => {
                    return { label: e, value: e };
                });
                // this.columns[3].filters = msg.filtsers.symptoms.map(e => {
                //     return { label: e, value: e };
                // })
            })
        },
        onFilterChange (e) {
            let filter = e._filterChecked[0] || ""
            this[e["fK"]] = filter;
            // this.getData();
        },
        remove (id) {
            this.$Modal.confirm({
                title: '确认删除',
                content: '<p>是否删除该科室？删除后无法恢复！</p>',
                onOk: () => {
                    axios.post("/api/hospital/RemoveHospitalDepart", { id }, msg => {
                        if (msg.success) {
                            this.$Message.success("删除成功");
                            this.getData();
                        } else {
                            this.$Message.error(msg.msg);
                        }
                    })
                },
                onCancel: () => {
                }
            });
        }
    },
    data () {
        return {
            isloading: false,
            showDialog: false,
            name: "",
            other: "",
            keyword: "",
            data: [],
            columns: [
                {
                    title: "名称",
                    key: "Name"
                },
                {
                    title: "别名",
                    slot: "OtherNames",
                    fK: "other",
                    filterMultiple: true,
                    filterMethod (value, row) {
                        return row.OtherNames.indexOf(value) >= 0;
                    },
                    filters: []
                },
                {
                    title: "搜索关键字",
                    slot: "Diseases",
                    fK: "keyword",
                    filterMultiple: true,
                    filterMethod (value, row) {
                        return row.Diseases.indexOf(value) >= 0;
                    },
                    filters: []
                },
                {
                    title: "可处理症状",
                    slot: "Symptoms",
                    fK: "symptoms"
                },
                {
                    title: "排序号（降序）",
                    key: "Sort"
                },
                {
                    title: "操作",
                    slot: "action"
                }
            ],
            rules: {
                Name: {required: true, message: "必须填写科室名"}
            },
            model: {
                Name: "",
                OtherNames: "",
                Diseases: "",
                Sort: 1
            }
        };
    },
    mounted () {
        app.title = "医院科室设置";
        this.getData();
    }
}
</script>

<style lang="less">
#hospital-depart-manager {
    padding: 8px;
    .searcher {
        margin-top: 8px;
    }
    .add-btn-area {
        width: 96px;
        button {
            width: 88px;
        }
    }
    .ivu-table-filter-list {
        width: 120px;
    }
}
</style>
