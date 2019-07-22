import AvatarUploader from './AvatarUploader'
import MobileVerify from './MobileVerify'
const installer = {
    install: function (Vue) {
        Vue.component("avatar-uploader", AvatarUploader);
        Vue.component("mobile-verify", MobileVerify);
    }
}

export default installer
