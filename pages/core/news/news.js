//xf.js
//获取应用实例
var app = getApp();
Page({
     data: {
          remind: '加载中',
          news: [], // 学费数据
     },

     // 页面加载
     onLoad: function() {
          var _this = this;
          
/*
          this.setData({
               news: wx.getStorageSync('news')
          })
          if (wx.getStorageSync('news') && wx.getStorageSync('news').length>0) {
               console.log('我没联网');
          }
          else {
               this.getBorrows();
               console.log('我联网了');
          }
*/

          this.getBorrows();
     },
     getBorrows: function (cb) {
          var _this = this;
          wx.showLoading({
               title: '获取通知中',
               mask: true
          })
          wx.request({
               method: 'POST',
               url: app._server + '/users/getNews',
               data: {
                    sid: app.wxuser.sid,
               },
               header: {
                    "Content-Type": "application/x-www-form-urlencoded"
               },
               success: function (res) {

                    if (res.statusCode == 200) {
                         console.log(res);
                         wx.hideLoading();
                         _this.setData({
                              news: res.data
                         })
                         wx.setStorage({
                              key: 'news',
                              data: res.data
                         })

                         wx.showToast({
                              title: '获取通知成功',
                              icon: 'success',
                              duration: 2000,
                              complete: function () {

                              } //接口调用结束的回调函数
                         });
                    } else {
                         app.showErrorModal('可能是网络出了点问题', '失败了');
                    }


               },
               fail: function (res) {
                    app.showErrorModal('可能是网络出了点问题', '失败了');
               },
               complete: function () {
                    wx.hideLoading();
                    if (typeof cb == "function") {
                         cb();
                    }
               }
          });
     },
     showDetails: function (event) {
          var index = event.currentTarget.dataset.index;
          wx.navigateTo({
               url: '../newsdetails/newsdetails?index=' + index,
          }) 
     }
});