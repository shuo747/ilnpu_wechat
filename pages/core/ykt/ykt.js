//ykt.js
//获取应用实例
var app = getApp();
Page({
     data: {
          remind: '',
          PCardBill: {} ,
          PCard:{}
     },
     onLoad: function() {
          var _this = this;
          this.setData({
               PCardBill: wx.getStorageSync('PCardBill'),
               PCard: wx.getStorageSync('PCard')
          })
          if (wx.getStorageSync('PCardBill')) {
               console.log('我没联网');
          }
          else {
               this.getPCardBill();
               console.log('我联网了');
          }
          
     },
     onPullDownRefresh: function () {
          this.getPCardBill(function () {
               wx.stopPullDownRefresh();
          });

     },
     getPCardBill: function (cb) {
          var _this = this;
          wx.showLoading({
               title: '获取卡信息中',
               mask: true
          })
          wx.request({
               method: 'POST',
               url: app._server + '/users/getPCardBill',
               data: {
                    openid: app.wxuser.openid,
               },
               header: {
                    "Content-Type": "application/x-www-form-urlencoded"
               },
               success: function (res) {

                    if (res.statusCode == 200) {
                         console.log(res);
                         wx.hideLoading();
                         _this.setData({
                              PCardBill: res.data
                         })
                         wx.setStorage({
                              key: 'PCardBill',
                              data: res.data
                         })

                         wx.showToast({
                              title: '获取信息成功',
                              icon: 'success',
                              duration: 2000,
                              complete: function () {

                              } //接口调用结束的回调函数
                         });
                    } else {
                         app.showErrorModal('可能是无信息', '失败了');
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


          //为了在刷新消费记录时同时刷新余额
          wx.request({
               method: 'POST',
               url: app._server + '/users/getPCard',
               data: {
                    openid: app.wxuser.openid
               },
               header: {
                    "Content-Type": "application/x-www-form-urlencoded"
               },
               success: function (res) {
                    console.log(res);
                    if (res.statusCode == 200) {
                         _this.setData({
                              PCard: res.data
                         })
                         wx.setStorage({
                              key: 'PCard',
                              data: res.data,
                         })
                         var pages = getCurrentPages();
                         var prePage = pages[pages.length-2];
                         prePage.setData({
                              PCard : res.data
                         })
                    }


               },
               fail: function (res) {
                    console.warn(status);
               }
          });
     }

});