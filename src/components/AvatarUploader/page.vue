<template>
    <div class="avatar-uploader">
        <label class="shower" :style="style" for="uploader">
            <Icon class="icon" type="ios-camera" :size="iconSize"></Icon>
        </label>
        <input type="file" id="uploader" ref="uploader" @change="onImageChanged($event, 1)" accept="image/png,image/jpeg,image/gif,image/jpg" />
        <p v-if="showText">点击上传png, jpg, jpeg格式的图片，推荐尺寸为{{width}}px &times; {{height}}px。</p>
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
</template>

<script>
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
                axios.postStream(this.action, {
                    fileName: "avatar.jpg",
                    usage: this.usage,
                    table: this.relateTable,
                    id: this.id,
                    single: this.single,
                    base64Img: data
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
                })
            });
        },
        onImageChanged (e, num) {
            var file = e.target.files[0];
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                this.$Message.warning("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
                return false;
            }
            var reader = new FileReader();
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
                this.showDialog = true;
            };
            reader.readAsArrayBuffer(file);
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
        showText: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        iconSize: {
            get () {
                let size = this.height > this.width ? this.width : this.height;
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
                width: this.width + 'px',
                height: this.height + 'px',
                lineHeight: this.height + 'px',
                background: ""
            },
            pic: this.value || require('../../assets/images/no-pic.jpg')
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

<style lang="less">
@import "../../assets/less/theme.less";
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
        overflow: hidden;
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
