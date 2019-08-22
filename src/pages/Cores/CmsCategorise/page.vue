<template>
  <i-row>
    <i-col span="8">
      <Tree ref="tree" :data="categoryTree" class="tree" :empty-text="emptyText" @on-select-change="selectCategory"></Tree>
    </i-col>
    <i-col span="16">
      <i-row class="searcher" type="flex">
          <i-col  span="2">
            <i-button size="large" type=“primary” class="ivu-btn ivu-btn-primary" @click="addModel()">新建</i-button>
          </i-col>
          <i-col span="18">
            <i-input prefix="ios-search" :disabled="display" size="large" placeholder="搜索分类名" v-model="keyword" @keyup.enter.native="getData()" />
          </i-col>
          <i-col span="4">
            <i-button size="large" type="text" @click="switchSearchMode()" class="ivu-btn ivu-btn-text">{{display?"普通搜索":"高级搜索"}}</i-button>
          </i-col>
      </i-row>
      <i-row style="height : 16px;"/>
      <i-row v-show="display" class="text">
        <i-col span="2">
          <span>分类名：</span>
        </i-col>
        <i-col span="8">
          <Input v-model="cateKeyword"/>
        </i-col>
        <i-col span="2">
          <span>导航名:</span>
        </i-col>
        <i-col span="8">
          <Input v-model="actKeyword"/>
        </i-col>
        <i-col span="2">
          <i-button type="primary" class="ivu-btn ivu-btn-primary" @click="advancedSearch">搜索</i-button>
        </i-col>
      </i-row>
      <i-row style="height : 5px;"/>
      <i-row type="flex" class="filter-keywords" v-if="filters.length">
        <i-col span="2" class="title">
          <i-col>
            <Icon type="ios-funnel" /><span style="font-size:12px;"> 检索项：</span>
          </i-col>
        </i-col>
        <i-col span="19">
            <template v-for="(item, index) in filters">
                <i-tag :key="index" closable @on-close="removeTag(index)">{{item.display}}</i-tag>
            </template>
            <i-button type="text" size="small" @click="removeAllTags">清除所有</i-button>
        </i-col>
      </i-row>
      <divider />
      <i-table class="data-table" stripe :columns="columns" :data="data" ref="dataTable">
          <template slot-scope="{row}" slot="Operation">
                <a class="btn" href="javascript:;" @click="addModel(row)">[修改]</a>
          </template>
      </i-table>
    </i-col>
      <i-modal title="添加/编辑新闻" v-model="showDialog" :mask-closable="false" :width="900">
        <i-form ref="form" :model="model" :label-width="100" :rules="rules">
          <i-form-item label="分类名" prop="CatName">
              <i-input v-model="model.CatName"/>
          </i-form-item>
          <i-form-item label="导航名" prop="Action">
              <i-input v-model="model.Action"/>
          </i-form-item>
          <i-form-item label="所属分类" prop="ParentId">
              <category-selector v-model="model.ParentId" :clearable="true"/>
          </i-form-item>
          <i-form-item label="排序号" prop="Reorder">
              <i-input v-model="model.Reorder"/>
              <p>排序号只能为<b>正整数</b></p>
          </i-form-item>
        </i-form>
        <div slot="footer">
            <Button type="primary" @click="confirm()" >确认</Button>
            <Button @click="showDialog=false" >取消</Button>
        </div>
      </i-modal>
  </i-row>
</template>

<script>
let app = require("@/config");
let axios = require("axios");
var _ = require("lodash");

export default {
    methods: {
      switchSearchMode () {
        if (this.display === false) {
          this.display = true;
        } else {
          this.display = false;
        }
      },
       selectCategory (node, n) {
                this.setFilter("CategoryId", n.id, "分类名", n.name);
        },
        setFilter (key, value, displayKey, displayValue) {
        let f = this.filters.findIndex(e => e.key === "id");
        if (value !== '00000000-0000-0000-0000-000000000000') {
          let ele = {
            key: "id",
            display: `${displayKey}：${displayValue}`,
            value: value
          }
          if (f > -1) {
            this.filters[f] = ele;
          } else {
            this.filters.push(ele);
          }
        } else {
            this.filters.splice(f, 1);
        }
        this.getData();
        this.clickAll(displayValue);
        },
      getcategoryTree () {
         axios.post("/api/cms/GetCategoryTree", { withEmpty: true }, msg => {
          if (msg.success) {
            this.emptyText = "数据加载中...";
            this.categoryTree = msg.data;
            console.log(this.categoryTree);
          }
        });
      },
      clickAll (displayValue) {
        if (displayValue === '所有分类') {
           this.filters.forEach(e => {
             if (e.key === 'id') {
              this.filters.splice(e, 1);
             }
        });
        this.getData();
        }
      },
      addModel (row) {
          let form = this.$refs["form"];
            row = row || {
              ID: "",
              CatName: "",
              Action: "",
              ParentId: "",
              Reorder: 1
            }
            this.model = {
                ID: row.ID,
                CatName: row.CatName,
                Action: row.Action,
                ParentId: row.ParentId,
                Reorder: row.Reorder
            };
            // let flag = !row;
            form.resetFields();
            this.showDialog = true;
        },
      confirm () {
        axios.post("/api/cms/SaveCategory", this.model, msg => {
          if (msg.success) {
            this.getData();
          }
        });
        this.showDialog = false;
      },
      getData () {
        let params = {
        }
        this.filters.forEach(e => {
            if (!e.key || !e.value) {
                return;
            }
            params[e.key] = e.value;
        });
        axios.post("/api/cms/categorylist", params, msg => {
          if (msg.success) {
            this.data = msg.data;
          }
        })
      },
      removeTag (index) {
        let item = this.filters.splice(index, 1);
        switch (item[0].key) {
          case "cate":
            this.keyword = "";
            this.cateKeyword = "";
            break;
          case "act":
            this.cateKeyword = "";
            break;
          case "id":
            this.keyword = "";
            this.cateKeyword = "";
            let tree = this.$refs["tree"];
            tree.handleSelect(0);
            break;
          default:
            break;
        }
        this.getData();
      },
      removeAllTags () {
        this.filters = [];
        this.keyword = "";
        this.cateKeyword = "";
        this.actKeyword = "";
        this.getData();
      },
      setAdvKeyword () {
      let cateKeyword = this.cateKeyword;
      let actKeyword = this.actKeyword;
      let f = this.filters.findIndex(e => e.key === "cate");
      if (cateKeyword) {
        let ele = {
          key: "cate",
          display: `分类名：${cateKeyword}`,
          value: cateKeyword
        }
        if (f > -1) {
          this.filters[f] = ele;
        } else {
          this.filters.push(ele);
        }
      } else {
        if (f > -1) {
          this.filters.splice(f, 1);
        }
      }
      f = this.filters.findIndex(e => e.key === "act");
      if (actKeyword) {
        let ele = {
          key: "act",
          display: `导航名：${actKeyword}`,
          value: actKeyword
        }
        if (f > -1) {
          this.filters[f] = ele;
        } else {
          this.filters.push(ele);
        }
      } else {
        if (f > -1) {
          this.filters.splice(f, 1);
        }
      }
      },
      advancedSearch () {
        this.setAdvKeyword();
        this.getData();
      },
      setKeyword: _.debounce(function () {
        let keyword = this.keyword;
        let f = this.filters.findIndex(e => e.key === "cate");
        if (keyword) {
          let ele = {
            key: "cate",
            display: `分类名：${keyword}`,
            value: keyword
          }
          if (f > -1) {
            this.filters[f] = ele;
          } else {
            this.filters.push(ele);
          }
        } else {
          if (f > -1) {
            this.filters.splice(f, 1);
          }
        }
        this.getData();
      }, 500)
    },
    data () {
        return {
            columns: [
                {
                    key: "CatName",
                    title: "分类"
                },
                {
                    key: "Action",
                    title: "导航名"
                },
                {
                    key: "ParentName",
                    title: "所属分类"
                },
                {
                    slot: "Operation",
                    title: "操作"
                }
            ],
            display: false,
            filters: [],
            data: [],
            categoryTree: [],
            emptyText: "暂无数据",
            keyword: "",
            cateKeyword: "",
            actKeyword: "",
            id: '00000000-0000-0000-0000-000000000000',
            showDialog: false,
            model: {},
            rules: {
              CatName: { required: true, message: "必须填写分类名" },
              Action: { required: true, message: "必须填写导航名" },
              ParentId: { required: true, message: "必须填写所属分类" },
              Reorder: { required: true, message: "必须填写排序号" }
            }
        };
    },
    watch: {
        keyword (v) {
            this.setKeyword();
        }
        /*
        $route () {
            let audit = this.$route.name.indexOf("Final") > -1 ? 5 : 4;
            this.getData(1, audit);
        }
        */
    },
    mounted () {
        app.title = "新闻分类管理";
        // let audit = this.$route.name.indexOf("Final") > -1 ? 5 : 4;
        this.getData();
        this.getcategoryTree();
    }
}
</script>

<style lang="less">
  .text{
    font-size: 14px;
    word-spacing: 2px;
    line-height: 32px;
    text-align: center;
  }
   .tree {
        background: #808695;
        color: #fff;
        width: 260px;
        min-height: fill-available;
        @import "../../../assets/less/orgTree.less";
    }
</style>
