//cj.js
//获取应用实例
var app = getApp();
Page({
     data: {
          stu: {},
          grades: {},
          remind: '',
          showModal: false,
          modalData: {}
     },
     onLoad: function() {

          var _this = this;
          //this.grades = wx.getStorageSync('grades')
          
          this.setData({
               stu: app.stu,
               grades: wx.getStorageSync('grades')
          })
          if (wx.getStorageSync('grades')) {         
               console.log('我没联网');
          }
          else{
               this.getGrades();
               console.log('我联网了');
          }
          if (!app.wxuser.sid) {
               _this.setData({
                    remind: '未绑定,回到首页绑定吧'
               });
               return false;
          }
     },
     onPullDownRefresh: function () {
          this.getGrades();
          wx.stopPullDownRefresh();//关闭下拉刷新
     },
     getGrades: function() {
          var _this = this;
          wx.showLoading({
               title: '获取成绩中',
               mask: true
          })
          wx.request({
               method: 'POST',
               url: app._server + '/users/getgrade',
               data: {
                    sid: app.wxuser.sid,
               },
               header: {
                    "Content-Type": "application/x-www-form-urlencoded"
               },
               success: function(res) {

                    if (res.statusCode == 200) {
                         console.log(res);
                         wx.hideLoading();

                         _this.setData({
                              grades: res.data

                         })
                         wx.setStorage({
                              key: 'grades',
                              data: res.data
                         })
                         wx.showToast({
                              title: '获取成绩成功',
                              icon: 'success',
                              duration: 2000,
                              complete: function() {

                              } //接口调用结束的回调函数
                         });
                    } else {
                         app.showErrorModal('可能是网络出了点问题', '失败了');
                         wx.hideLoading();
                    }


               },
               fail: function(res) {
                    wx.hideLoading();
                    app.showErrorModal('可能是网络出了点问题', '失败了');
               },
               complete: function() {
                   
               }
          });
     },
     showGradeDetail: function(event) {
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
     preventTouchMove: function() {},
     /**
      * 隐藏模态对话框
      */
     hideModal: function() {
          this.setData({
               showModal: false
          });
     }
});