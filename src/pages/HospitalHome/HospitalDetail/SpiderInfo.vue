<template>
    <i-tab-pane label="蜘蛛信息" id="spider-info" name="spider-info">
        <i-row>
            <i-col span="24">
                <i-form id="generate" :model="model" :label-width="120">
                    <!-- 综合模块 -->
                    <div>
                        <i-form-item label="网站地址">
                            <i-input v-model="model.index" />
                            <p>结尾不带“{{"/"}}”。</p>
                        </i-form-item>
                        <i-form-item label="网站编码">
                            <i-select v-model="model.encoding">
                                <i-option v-for="item in encodes" :key="item" :value="item">{{item}}</i-option>
                            </i-select>
                        </i-form-item>
                        <i-form-item label="必须去掉的内容">
                            <i-input v-model="model.removeRegexs" type="textarea"/>
                            <p>每行一个正则表达式</p>
                        </i-form-item>
                        <i-form-item label="最后抓取时间">
                            {{ model.lastRun ? model.lastRun : "没有抓取过" }}
                        </i-form-item>
                        <i-form-item>
                            <i-button type="primary" @click="save">提交</i-button>
                        </i-form-item>
                        <divider />
                    </div>
                    <!-- 医院概述 -->
                    <div>
                        <h3 class="form-item-title">医院概况抓取配置</h3>
                        <i-form-item label="医院概况页面">
                            <i-input v-model="model.aboutPage" />
                        </i-form-item>
                        <i-form-item label="抓取内容">
                            <i-input v-model="model.aboutSelector" />
                            <p>要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                        </i-form-item>
                        <i-form-item>
                            <i-button type="primary" @click="save">提交</i-button>
                        </i-form-item>
                        <i-divider />
                    </div>
                    <!-- 医院科室信息抓取 -->
                    <div>
                        <h3 class="form-item-title">医院科室和专家</h3>
                        <i-form-item label="科室列表页面">
                            <i-input v-model="model.departList" />
                        </i-form-item>
                        <i-form-item label="科室定位">
                            <i-input v-model="model.departListPath" />
                            <p>列表中，科室所在<b>a</b>标签的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                        </i-form-item>
                        <i-form-item label="科室名称正则">
                            <i-input v-model="model.departName" />
                            <p>在上述定位的标签中，如何取到科室名称，不写表示直接取InnerHtml。匹配成功后，取“<b>dptName</b>”组。</p>
                        </i-form-item>
                        <i-form-item label="科室简介定位">
                            <i-input v-model="model.departDetail" />
                            <p>详细页面中，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                        </i-form-item>
                        <i-form-item label="专家的抓取模式">
                            <i-radio-group v-model="model.expertMode">
                                <i-radio label="in-page">
                                    在本页面中
                                </i-radio>
                                <i-radio label="next-page">
                                    在下个页面中
                                </i-radio>
                            </i-radio-group>
                        </i-form-item>
                        <template v-if="model.expertMode === 'in-page'">
                            <i-form-item label="专家列表">
                                <i-input v-model="model.expertList" />
                                <p>在科室详细页面中，专家列表的定位元素。要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家名称">
                                <i-input v-model="model.expertName" />
                                <p>在专家列表的定位内，专家名称的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家头像">
                                <i-input v-model="model.avatar" />
                                <p>在专家列表的定位内，专家头像的定位，<b style="color: red;">由于版权问题，没有特殊情况请放空</b>。要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家级别">
                                <i-input v-model="model.expertLevel" />
                                <p>在专家列表的定位内，专家级别(主任医师，主治医师等)的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家出诊时间">
                                <i-input v-model="model.expertSchedule" />
                                <p>在专家列表的定位内，专家出诊时间的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家特长">
                                <i-input v-model="model.expertSkill" />
                                <p>在专家列表的定位内，专家特长的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家介绍">
                                <i-input v-model="model.expertIntroduce" />
                                <p>在专家的详细页面内，专家特长的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                        </template>
                        <template v-if="model.expertMode === 'next-page'">
                            <i-form-item label="专家列表">
                                <i-input v-model="model.expertList" />
                                <p>列表中，科室所在<b>a</b>标签的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家名称">
                                <i-input v-model="model.expertName" />
                                <p>在专家的详细页面内，专家名称的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家头像">
                                <i-input v-model="model.expertAvatar" />
                                <p>在专家的详细页面内，专家头像的定位，<b style="color: red;">由于版权问题，没有特殊情况请放空</b>。要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家级别">
                                <i-input v-model="model.expertLevel" />
                                <p>在专家的详细页面内，专家级别(主任医师，主治医师等)的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家出诊时间">
                                <i-input v-model="model.expertSchedule" />
                                <p>在专家的详细页面内，专家出诊时间的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家特长">
                                <i-input v-model="model.expertSkill" />
                                <p>在专家的详细页面内，专家特长的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                            <i-form-item label="专家介绍">
                                <i-input v-model="model.expertIntroduce" />
                                <p>在专家的详细页面内，专家特长的定位，要抓取内容的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                            </i-form-item>
                        </template>
                        <i-form-item>
                            <i-button type="primary" @click="save">提交</i-button>
                        </i-form-item>
                        <i-divider />
                    </div>
                    <!-- 招标信息抓取配置 -->
                    <div>
                        <h3 class="form-item-title">招标信息抓取配置</h3>
                        <i-form-item label="抓取模式">
                            <i-radio-group v-model="model.bidMode">
                                <i-radio v-for="item in listModes" :key="item.value" :label="item.value">
                                    {{item.label}}
                                </i-radio>
                            </i-radio-group>
                        </i-form-item>
                        <i-form-item label="页面名">
                            <i-input v-model="model.bidPage" />
                        </i-form-item>
                        <i-form-item label="列表定位">
                            <i-input v-model="model.bidListPath" />
                            <p>要新闻列表所在<b>a</b>标签的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                        </i-form-item>
                        <i-form-item label="必有的关键字">
                            <i-input v-model="model.bidKeyword" />
                            <p>在a标签的内容中，必须出现的关键字。</p>
                        </i-form-item>
                        <i-form-item label="新闻的有效期">
                            <i-input-number v-model="model.bidExpire" />
                            <p>以月为单位，超出有效期的新闻不接收。</p>
                        </i-form-item>
                        <i-form-item label="最少拉取的条目">
                            <i-input-number v-model="model.bidMin" />
                            <p>为了防止有置顶的新闻，在不考虑新闻有效期的提前下，拉取的最小条数（包含此数值）。</p>
                        </i-form-item>
                        <i-form-item label="下一页的正则">
                            <i-input v-model="model.bidNextPagePath" />
                            <p>如何定位下一页的正则，定位成功取“<b>href</b>”组中的内容。{{aRegex}}</p>
                        </i-form-item>
                        <i-form-item label="新闻标题定位">
                            <i-input v-model="model.bidTitlePath" />
                            <p>在新闻的<b>详细页面</b>内，如何定位新闻标题。</p>
                        </i-form-item>
                        <i-form-item label="发布日期定位">
                            <i-input v-model="model.bidReleaseTimePath" />
                            <p>在新闻的<b>详细页面</b>内，如何定位发布日期。</p>
                        </i-form-item>
                        <i-form-item label="发布日期正则">
                            <i-input v-model="model.bidReleaseTimeRegex" />
                            <p>在新闻的<b>详细页面</b>内，如何取发布日期，定位成功取“<b>release</b>”组。{{releaseRegex}}（留空视为全部取）</p>
                        </i-form-item>
                        <i-form-item label="正文定位">
                            <i-input v-model="model.bidContentPath" />
                            <p>在新闻的<b>详细页面</b>内，如何定位正文。</p>
                        </i-form-item>
                        <i-form-item label="详细页面下一页">
                            <i-input v-model="model.bidNextPagePathInDetail" />
                            <p>在新闻的<b>详细页面</b>内，使用a标签的内容定位的方法确认下一页，注意必须要把“{{'>'}}”这种符号变成“{{"&amp;gt;"}}”这样的HTML符号。</p>
                        </i-form-item>
                        <i-form-item>
                            <i-button type="primary" @click="save">提交</i-button>
                        </i-form-item>
                        <i-divider />
                    </div>
                    <!-- 人才招聘 -->
                    <div>
                        <h3 class="form-item-title">人才招聘抓取配置</h3>
                        <i-form-item label="抓取模式">
                            <i-radio-group v-model="model.recruitMode">
                                <i-radio v-for="item in listModes" :key="item.value" :label="item.value">
                                    {{item.label}}
                                </i-radio>
                            </i-radio-group>
                        </i-form-item>
                        <i-form-item label="页面名">
                            <i-input v-model="model.recruitPage" />
                        </i-form-item>
                        <i-form-item label="列表定位">
                            <i-input v-model="model.recruitListPath" />
                            <p>要新闻列表所在<b>a</b>标签的XPath，在Chrome中，选用合适元素的“Copy” -> “Copy XPath”命令。</p>
                        </i-form-item>
                        <i-form-item label="必有的关键字">
                            <i-input v-model="model.recruitKeyword" />
                            <p>在a标签的内容中，必须出现的关键字。</p>
                        </i-form-item>
                        <i-form-item label="新闻的有效期">
                            <i-input-number v-model="model.recruitExpire" />
                            <p>以月为单位，超出有效期的新闻不接收。</p>
                        </i-form-item>
                        <i-form-item label="最少拉取的条目">
                            <i-input-number v-model="model.recruitMin" />
                            <p>为了防止有置顶的新闻，在不考虑新闻有效期的提前下，拉取的最小条数（包含此数值）。</p>
                        </i-form-item>
                        <i-form-item label="下一页的正则">
                            <i-input v-model="model.recruitNextPagePath" />
                            <p>如何定位下一页的正则，定位成功取“<b>href</b>”组中的内容。“{{aRegex}}”</p>
                        </i-form-item>
                        <i-form-item label="新闻标题定位">
                            <i-input v-model="model.recruitTitlePath" />
                            <p>在新闻的<b>详细页面</b>内，如何定位新闻标题。</p>
                        </i-form-item>
                        <i-form-item label="发布日期定位">
                            <i-input v-model="model.recruitReleaseTimePath" />
                            <p>在新闻的<b>详细页面</b>内，如何定位发布日期。</p>
                        </i-form-item>
                        <i-form-item label="发布日期正则">
                            <i-input v-model="model.recruitReleaseTimeRegex" />
                            <p>在新闻的<b>详细页面</b>内，如何取发布日期，定位成功取“<b>release</b>”组。“{{releaseRegex}}”（留空视为全部取）</p>
                        </i-form-item>
                        <i-form-item label="正文定位">
                            <i-input v-model="model.recruitContentPath" />
                            <p>在新闻的<b>详细页面</b>内，如何定位正文。</p>
                        </i-form-item>
                        <i-form-item label="详细页面下一页">
                            <i-input v-model="model.recruitNextPagePathInDetail" />
                            <p>在新闻的<b>详细页面</b>内，使用a标签的内容定位的方法确认下一页，注意必须要把“{{'>'}}”这种符号变成“{{"&amp;gt;"}}”这样的HTML符号。</p>
                        </i-form-item>
                        <i-divider />
                    </div>
                    <i-form-item>
                        <i-button type="primary" @click="save">提交</i-button>
                    </i-form-item>
                </i-form>
            </i-col>
        </i-row>
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
        },
        value: {
            type: Object | Array,
            required: true
        }
    },
    methods: {
        save () {
            let id = this.id;
            let configs = JSON.stringify(this.model);
            configs = encodeURI(configs);
            axios._post("/api/hospital/SaveSpider", { id, configs }).then(data => {
                let msg = data.data;
                if (msg.success) {
                    this.$Message.success("保存成功");
                } else {
                    this.$Message.warning(msg.msg);
                }
            })
        }
    },
    data () {
        return {
            model: this.value,
            aRegex: '\\<a href="(?<href>[^\\s\\t\\r\\n""\'<>]*)"\\>下一页»\\</a\\>',
            releaseRegex: "发布时间：(?<release>[0-9\\-]*)",
            encodes: [ "GBK", "UTF-8", "GB2312", "Big5" ],
            listModes: [
                {
                    label: "普通模式",
                    value: "normal",
                    tips: "正常的操作模式，适用于大部分医院"
                }
            ]
        }
    },
    watch: {
        model: {
            deep: true,
            handler (v, ov) {
                this.$emit("input", v);
            }
        },
        value: {
            deep: true,
            handler (v) {
                v.recruitExpire = parseInt(v.recruitExpire);
                v.recruitMin = parseInt(v.recruitMin);
                v.bidExpire = parseInt(v.bidExpire);
                v.bidMin = parseInt(v.bidMin);
                this.model = v;
            }
        }
    }
}
</script>

<style lang="less">
#spider-info {
    width: 100%;
    padding: 5px;
    .ivu-affix {
        transform: translateX(-400%);
    }
    .form-item-title {
        margin-bottom: 8px;
    }
}
</style>
