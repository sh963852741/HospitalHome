import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const components = {
  Login: {
    path: "/manage/login",
    layout: "login",
    component: () => import(/* webpackChunkName: "setting" */"@p/UCenter/Login")
  },
  Forgot: {
    path: "/manage/forgot",
    layout: "login",
    component: () => import(/* webpackChunkName: "setting" */"@p/UCenter/ForgotPassword")
  },
  Register: {
    path: "/manage/register",
    layout: "login",
    component: () => import(/* webpackChunkName: "setting" */"@p/UCenter/Register")
  },
  Dashboard: {
    path: "/manage/dashboard",
    layout: "admin",
    component: () => import(/* webpackChunkName: "security" */"@p/Dashboard")
  },
  UserManager: {
    path: "/manage/usermanager",
    layout: "admin",
    component: () => import(/* webpackChunkName: "security" */"@p/Cores/UserManager")
  },
  RoleManager: {
    path: "/manage/rolemanager",
    layout: "admin",
    component: () => import(/* webpackChunkName: "security" */"@p/Cores/RoleManager")
  },
  SystemConfig: {
    path: "/manage/config/system",
    layout: "admin",
    component: () => import(/* webpackChunkName: "config" */"@p/Cores/SystemConfig")
  },
  DataDictionary: {
    path: "/manage/config/datadictionary",
    layout: "admin",
    component: () => import(/* webpackChunkName: "config" */"@p/Cores/DataDictionary")
  },
  HospitalDepartManage: {
    path: "/manage/config/hospitaldepart",
    layout: "admin",
    component: () => import(/* webpackChunkName: "hospital" */"@p/HospitalHome/HospitalDepartManage")
  },
  HospitalList: {
    path: "/manage/hospital/list",
    layout: "admin",
    component: () => import(/* webpackChunkName: "hospital" */"@p/HospitalHome/HospitalList")
  },
  HospitalCms: {
    path: "/manage/hospital/cms",
    component: () => import(/* webpackChunkName: "hospital" */"@p/HospitalHome/HospitalCms")
  },
  HospitalDetail: {
    path: "/manage/hospital/detail",
    layout: "admin",
    component: () => import(/* webpackChunkName: "hospital" */"@p/HospitalHome/HospitalDetail")
  },
  ContributorList: {
    path: "/manage/contributor/list",
    layout: "admin",
    component: () => import(/* webpackChunkName: "CodeContributor" */"@p/CodeContributor/List")
  },
  MyCode: {
    path: "/manage/contributor/my",
    layout: "admin",
    component: () => import(/* webpackChunkName: "CodeContributor" */"@p/CodeContributor/MyCode")
  },
  Commits: {
    path: "/manage/contributor/commits",
    layout: "admin",
    component: () => import(/* webpackChunkName: "CodeContributor" */"@p/CodeContributor/Commits")
  }
}

function generatePath (page) {
  let obj = components[page];
  let result = {
    path: '/' + page,
    name: page,
    meta: { layout: "admin" },
    component: null
  };
  if (typeof obj === "function") {
    result.component = obj;
  } else {
    if (obj.layout) {
      obj.meta = { layout: obj.layout };
    }
    result = {...result, ...obj};
  }
  return result;
}

let pages = [];
for (let pc in components) {
  pages.push(generatePath(pc));
}

export default new Router({
  mode: "history",
  routes: pages
})
