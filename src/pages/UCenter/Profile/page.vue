<template>
  <card>
    <i-form label-position="top" style="margin:20px">
        <formItem label="个人信息"></formItem>
        <formItem label="昵称" >
            <i-input style="width:700px;" type="text" size="large"/>
        </formItem>
        <formItem label="简介">
            <i-input style="width:700px;" type="textarea" size="large" rows="5"/>
        </formItem>
        <formItem label="地址">
            <i-input style="width:700px;" type="text" size="large"/>
        </formItem>
        <formItem label="职业">
            <i-input style="width:700px;" type="text" size="large"/>
        </formItem>
        <formItem label="头像">
          <i-row>
            <i-col span="2">/**span="2"下方为组建 */
              <div class="avatar-uploader">
                  <label class="shower" :style="style" for="uploader">
                    <Icon class="icon" type="ios-camera" :size="iconSize"></Icon>
                  </label>
                <input type="file" id="uploader" ref="uploader" @change="onImageChanged($event, 1)" accept="image/png,image/jpeg,image/gif,image/jpg" />
                <i-modal title="裁剪图片" :value.sync="showDialog" width="600px" class="clip-dialog" :mask-closable="false">
                    <VueCropper ref="cropper" class="cropper" :high="true" :img="image" :autoCrop="true" :centerBox="true"
                    :autoCropWidth="width" :autoCropHeight="height" :fixed="true" :fixedBox="fixedBox"
                    :fixedNumber="[width, height]" />
                    <div slot="footer">
                        <Button type="primary" :loading="isloading" @click="confirm()" >确认</Button>
                         <Button @click="showDialog=false" >取消</Button>
                    </div>
                </i-modal>
              </div>
            </i-col>
            <i-col span="15">
              <i-button icon="md-download" >上传头像</i-button>
              <br/>
              可以拖动图片到左边头像区域完成上传
            </i-col>
          </i-row>
           <i-button type="success" style="margin-top:5px">确认更新</i-button>
        </formItem>
      </i-form>
    </card>
  </template>
<script> // script均为组建，与老师的组建唯一改动之处在data(){style{width,height}}更改了大小 老师的组建在components/AvatarUpLoader
import { VueCropper } from 'vue-cropper'
let axios = require("axios");
export default {
    components: { VueCropper },
    methods: {
        confirm () {
            let cropper = this.$refs.cropper;
            this.isloading = true;
            cropper.getCropData(data => {
                data = data.substring(data.indexOf(',') + 1)
                this.uploadImage(data);
            });
        },
        onImageChanged (e, num) {
            var file = e.target.files[0];
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                this.$Message.warning("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
                return false;
            }
            var reader = new FileReader();
            let base64 = function (buffer) {
                var binary = '';
                var bytes = new Uint8Array(buffer);
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            }
            reader.onload = e => {
                let data;
                this.$refs.uploader.value = "";
                if (typeof e.target.result === "object") {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]));
                } else {
                    data = e.target.result;
                }
                this.image = data;
                if (this.needCrop) {
                    this.showDialog = true;
                } else {
                    let code = base64(e.target.result);
                    this.uploadImage(code);
                }
            };
            reader.readAsArrayBuffer(file);
        },
        uploadImage (base64Code) {
            axios.postStream(this.action, {
                fileName: "avatar.jpg",
                usage: this.usage,
                table: this.relateTable,
                id: this.id,
                single: this.single,
                base64Img: base64Code
            }, msg => {
                if (!msg.success) {
                    this.isloading = false;
                    this.showDialog = false;
                    this.$Message.warning(msg.msg);
                } else {
                    this.isloading = false;
                    this.showDialog = false;
                    this.$Message.success("上传成功");
                    this.style.background = `url(${msg.download})`;
                    this.$emit("input", msg.download);
                }
            });
        },
        onSuccess (response, file, fileList) {
            console.log(response, file, fileList)
        }
    },
    props: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        displayWidth: {
            type: Number,
            required: false
        },
        displayHeight: {
            type: Number,
            required: false
        },
        action: {
            type: String,
            default: "/api/cms/UploadImage"
        },
        relateTable: String,
        usage: {
            type: String,
            required: true
        },
        value: String,
        fixedBox: Boolean,
        id: String,
        single: Boolean,
        needCrop: {
            type: Boolean,
            default: true
        },
        showText: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        iconSize: {
            get () {
                let height = this.displayHeight || this.height;
                let width = this.displayWidth || this.width;
                let size = height > width ? width : height;
                return size / 4;
            }
        }
    },
    data () {
        let data = {
            showDialog: false,
            image: "",
            isloading: false,
            params: {
                relateTable: this.relateTable,
                usage: this.usage ? this.usage : "imgAvatar",
                single: this.single
            },
            style: {
                width: 80 + 'px',
                height: 80 + 'px',
                lineHeight: (this.displayHeight || this.height) + 'px',
                "background-size": "cover",
                background: ""
            },
            pic: this.value || require('../../../assets/images/no-pic.jpg')
        };
        return data;
    },
    watch: {
        value (v) {
            this.style.background = `url(${v})`;
        }
    },
    mounted () {
        this.style.background = `url(${this.pic})`;
    }
}
</script>

<style lang="less">//同script
@import "../../../assets/less/theme.less";
.clip-dialog {
    .ivu-modal-body {
        height: 300px;
    }
}
.avatar-uploader {
    .shower {
        display: block;
        background-size: cover !important;
        border: 1px dashed @border-color-base;
        border-radius: @border-radius-small;
        text-align: center;
        cursor: pointer;
        position: relative;
        transition: border-color @transition-time ease;
        .icon {
            opacity: 0;
            display: inline-blcok;
            transition: opacity @transition-time ease;
        }
        &:hover {
            border: 1px dashed @primary-color;
            .icon {
                opacity: 1;
            }
        }
    }
    input[type='file'] {
        width: 0px;
        height: 0px;
        position: absolute;
    }
}
</style>
