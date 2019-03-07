//cj.js
//获取应用实例
var app = getApp();
Page({
     data: {
          stu: {},
          grades: {},
          remind: '',
          showModal: false,
          modalData: {},
          sid : {}
     },
     onLoad: function (options) {

          console.log("接收到的参数是sid=" + options.sid);
          var sid = options.sid;
          //var index = 5;
          var _this = this;
          _this.setData({
               sid :　sid
          })
      
          wx.showLoading({
               title: '获取成绩中',
               mask: true
          })
          wx.request({
               method: 'POST',
               url: app._server + '/users/getgradecache',
               data: {
                    openid: app.wxuser.openid,
                    sid: sid
               },
               header: {
                    "Content-Type": "application/x-www-form-urlencoded"
               },
               success: function (res) {

                    if (res.statusCode == 200) {
                         console.log(res);
                         wx.hideLoading();
                         _this.setData({
                              grades: res.data

                         })
                         wx.showToast({
                              title: '获取成绩成功',
                              icon: 'success',
                              duration: 2000,
                              complete: function () {



                              } //接口调用结束的回调函数
                         });
                    } else {
                         wx.navigateTo({
                              url: 'gradesearch?sid=' + sid,
                         }) 
                         app.showErrorModal('可能是网络出了点问题', '失败了');
                         wx.hideLoading();
                    }


               },
               fail: function (res) {
                    wx.hideLoading();
                    wx.navigateTo({
                         url: 'gradesearch?sid=' + sid,
                    }) 
                    app.showErrorModal('可能是网络出了点问题', '失败了');
               },
               complete: function () {

               }
          });
     },
     getGrades: function (sid) {
          var _this = this;
          
     },
     showGradeDetail: function (event) {
          console.log(event)
          var info = event.currentTarget.dataset;
          this.setData({
               showModal: true,
               modalData: {
                    cid: info.cid,
                    cname: info.cname,
                    examtype: info.examtype,
                    cmode: info.cmode,
                    results: info.results,
                    credits: info.credits,
                    school: info.school,
                    resultstype: info.resultstype
               }


          })
     },
     preventTouchMove: function () { },
     /**
      * 隐藏模态对话框
      */
     hideModal: function () {
          this.setData({
               showModal: false
          });
     }
});