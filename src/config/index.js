let appSetting = {
    debug: true,
    api: "",
    currentUserGuid: "",
    titlePerfix: " - ",
    title: "登录",
    nav: "",
    reloadOrg: "",
    userInfo: {},
    checkPermission () { return false; },
    webInfo: {
        avatar: "",
        nmsOpen: false,
        subtitle: "",
        title: ""
    },
    dashboard: { name: "HospitalList" }
};

module.exports = appSetting;
