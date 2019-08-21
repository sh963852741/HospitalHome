import AvatarUploader from './AvatarUploader'
import MobileVerify from './MobileVerify'
import CategorySelector from './CategorySelector'
const installer = {
    install: function (Vue) {
        Vue.component("avatar-uploader", AvatarUploader);
        Vue.component("mobile-verify", MobileVerify);
        Vue.component("category-selector", CategorySelector);
    }
}

export default installer
