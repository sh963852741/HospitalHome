<template>
  <card>
        <i-form ref="user-form" label-position="top" style="margin:20px" :model="model" :rules="rules">
            <formItem label="个人信息"></formItem>
            <formItem label="姓名" prop="realName">
                <i-input style="width:700px;" type="text" size="large" v-model="model.realName"/>
            </formItem>
            <formItem label="学/工号" prop="code">
                <i-input style="width:700px;" disabled type="text" size="large" v-model="model.code" />
            </formItem>
            <formItem label="手机" prop="mobile">
                <i-input style="width:700px;" type="text" size="large" v-model="model.mobile"/>
            </formItem>
            <formItem label="邮箱" prop="email">
                <i-input style="width:700px;" type="text" size="large" v-model="model.email"/>
            </formItem>
            <formItem label="头像" prop="avatar">
                <i-row>
                    <i-col span="3">
                    <avatar-uploader :width="128" :height="128" usage="imgAvatar" single relate-table="Users" v-model="model.avatar"/>
                    </i-col>
                    <i-col span="15">
                    <i-button icon="md-download" >上传头像</i-button>
                    <br/>
                    可以拖动图片到左边头像区域完成上传
                    </i-col>
                </i-row>
                <i-button type="success" style="margin-top:10px" @click="save">确认更新</i-button>
            </formItem>
        </i-form>
    </card>
  </template>
<script>
 const regex = require("@/regex.js")
let app = require("@/config");
 var _ = require("lodash")
 const axios = require("axios");
export default {
    methods: {
        save () {
                let form = this.$refs["user-form"];
                let model = this.model;
                this.isSaving = true;
                    form.validate(err => {
                if (!err) {
                    this.isSaving = false;
                    return;
                }

                axios.post("/api/security/SaveUser", model, msg => {
                    if (!msg.success) {
                        this.$Message.error(msg.msg);
                    } else {
                        this.$Message.success("修改成功");
                        this.cancel();
                    }
                    this.isSaving = false;
                })
            })
        }
    },
    data () {
         let This = this;
        return {
            model: {
            },
            isSaving: true,
            rules: {
               "mobile": [
                   {required: true, message: "必须输入手机号", trigger: "blur", type: "number"},
                   {type: "string", pattern: regex.mobile, message: "手机格式不正确", trigger: "blur"},
                   _.debounce(function (rule, value, cb, source, options) {
                       let userId = This.model.token;
                       axios.post("/api/security/MobileValidate", { userId, mobile: value }, msg => {
                           if (msg.success) {
                               cb();
                           } else {
                               cb(msg.remote);
                           }
                       })
                   }, 500)
               ],
               "email": [
                   {required: true, message: "必须输入电子邮箱", trigger: "blur", type: "email"},
                   {type: "string", pattern: regex.email, message: "电子邮箱格式不正确", trigger: "blur"},
                   _.debounce((rule, value, cb, source, options) => {
                       let userId = This.model.token;
                       axios.post("/api/security/EmailValidate", { userId, email: value }, msg => {
                           if (msg.success) {
                               cb();
                           } else {
                               cb(msg.remote);
                           }
                       })
                   }, 500)
               ],
               "code": [
                   {required: true, message: "必须输入学/工号", trigger: "blur"},
                   _.debounce(function (rule, value, cb, source, options) {
                       let userId = this.model.token;
                       axios.post("/api/security/CodeValidate", { userId, code: value }, msg => {
                           if (msg.success) {
                               cb();
                           } else {
                               cb(msg.remote);
                           }
                       })
                   }, 500)
               ],
               "realName": {required: true, message: "必须输入姓名", trigger: "blur"},
               "avatar": {required: true, message: "必须上传图片", trigger: "blur"}
            }
        };
    },
    mounted () {
        this.model = app.userInfo
    }
}
</script>
<style lang="less">
</style>
