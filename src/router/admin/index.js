module.exports = {
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
        showAs: "MyCode",
        component: () => import(/* webpackChunkName: "CodeContributor" */"@p/CodeContributor/Commits")
      },
      ImportAuditor: {
        path: "/manage/contributor/ImportAuditor",
        layout: "admin",
        component: () => import(/* webpackChunkName: "CodeContributor" */"@p/CodeContributor/ImportAuditor")
      },
      HospitalReview: {
        path: "/manage/reviews/hospitals",
        layout: "admin",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/HospitalList")
      },
      HospitalReviewDetail: {
        path: "/manage/reviews/hospital",
        layout: "admin",
        showAs: "HospitalReview",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/HospitalDetail")
      },
      DepartReview: {
        path: "/manage/reviews/departs",
        layout: "admin",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/DepartList")
      },
      DepartReviewDetail: {
        path: "/manage/reviews/depart",
        layout: "admin",
        showAs: "DepartReview",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/DepartDetail")
      },
      ExpertReview: {
        path: "/manage/reviews/experts",
        layout: "admin",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/ExpertList")
      },
      ExpertReviewDetail: {
        path: "/manage/reviews/expert",
        layout: "admin",
        showAs: "ExpertReview",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/ExpertDetail")
      },
      HospitalFinal: {
        path: "/manage/final/hospitals",
        layout: "admin",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/HospitalList")
      },
      HospitalFinalDetail: {
        path: "/manage/final/hospital",
        layout: "admin",
        showAs: "HospitalFinal",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/HospitalDetail")
      },
      DepartFinal: {
        path: "/manage/final/departs",
        layout: "admin",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/DepartList")
      },
      DepartFinalDetail: {
        path: "/manage/final/depart",
        layout: "admin",
        showAs: "DepartFinal",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/DepartDetail")
      },
      ExpertFinal: {
        path: "/manage/final/experts",
        layout: "admin",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/ExpertList")
      },
      ExpertFinalDetail: {
        path: "/manage/final/expert",
        layout: "admin",
        showAs: "ExpertFinal",
        component: () => import(/* webpackChunkName: "Reviews" */"@p/Reviews/ExpertDetail")
      },
      SymptomGuide: {
        path: "/manage/hospital/SymptomGuide",
        layout: "admin",
        component: () => import(/* webpackChunkName: "hospital" */"@p/HospitalHome/SymptomGuide")
      }
};
