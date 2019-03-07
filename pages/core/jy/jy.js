//jy.js
//获取应用实例
var app = getApp();
Page({
     data: {
          showModal: false,
          modalData: {},
          test : '测试文字有书超期',
          borrows: {},
          remind: '',
          jyHistoryTap: false //点击历史借阅
     },
     onLoad: function() {
          var _this = this;
          //this.getBorrows();

          this.setData({
               borrows: wx.getStorageSync('borrows')
          })
          if (wx.getStorageSync('borrows')) {
               console.log('我没联网');
          }
          else {
               this.getBorrows();
               console.log('我联网了');
          }
          
     },
     jyHistory :function(e){
          console.log('jyHistory');
          wx.navigateTo({
               url: '../borrowhistory/borrowhistory',
          })
     },
     getBorrows: function(cb) {
          var _this = this;
          wx.showLoading({
               title: '获取借阅信息中',
               mask: true
          })
          wx.request({
               method: 'POST',
               url: app._server + '/users/getBorrows',
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
                              borrows: res.data
                         })
                         wx.setStorage({
                              key: 'borrows',
                              data: res.data
                         })
                         
                         wx.showToast({
                              title: '获取借阅成功',
                              icon: 'success',
                              duration: 2000,
                              complete: function() {

                              } //接口调用结束的回调函数
                         });
                    } else {
                         app.showErrorModal('可能是网络出了点问题', '失败了');
                    }


               },
               fail: function(res) {
                    app.showErrorModal('可能是网络出了点问题', '失败了');
               },
               complete: function() {
                    wx.hideLoading();
                    if (typeof cb == "function") {
                         cb();
                    }
               }
          });
     },
     onPullDownRefresh: function() {
          this.getBorrows(function () {
               wx.stopPullDownRefresh();
          });
         
     },

//续借
     renew: function (event) {
          console.log('renew');
          console.log(event);
          var _this = this;
          var barcode = event.currentTarget.dataset.barcode;
          wx.showLoading({
               title: '续借中',
               mask: true
          })
          wx.request({
               method: 'POST',
               url: app._server + '/users/renew',
               data: {
                    sid: app.wxuser.sid,
                    barcode : barcode
               },
               header: {
                    "Content-Type": "application/x-www-form-urlencoded"
               },
               success: function (res) {
                    console.log(res);
                    if (res.statusCode == 200 && res.data==true) {     
                         wx.hideLoading();
                         _this.getBorrows();
                         wx.showToast({
                              title: '续借成功',
                              icon: 'success',
                              duration: 2000,
                              complete: function () {

                                   _this.setData({
                                        showModal : false 
                                   })
                              } //接口调用结束的回调函数
                         });
                    } else {
                         app.showErrorModal('可能是未到续借时间', '失败了');
                    }


               },
               fail: function (res) {
                    wx.hideLoading();
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
     onPullDownRefresh: function () {
          this.getBorrows(function () {
               wx.stopPullDownRefresh();
          });

     },

     //显示详情
     showCardView: function (event) {
          console.log(event)
          var info = event.currentTarget.dataset;
          this.setData({
               showModal: true,
               modalData: {
                    barcode: info.barcode,
                    bname: info.bname,
                    author: info.author,
                    timelent: info.timelent,
                    timeback: info.timeback,
                    location: info.location,
                    details: info.details
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
     },
});