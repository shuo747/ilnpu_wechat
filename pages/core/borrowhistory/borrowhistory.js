//jy.js
//获取应用实例
var app = getApp();
Page({
     data: {
          showModal: false,
          modalData: {},
          test: '测试文字有书超期',
          borrows: {},
          remind: '',
          jyHistoryTap: false //点击历史借阅
     },
     onLoad: function() {
          var _this = this;
          //this.getBorrows();

          this.setData({
               borrows: wx.getStorageSync('borrowshis')
          })
          if (app.cache.borrowshis) {
               console.log('我没联网');
          } else {
               this.getBorrows();
               console.log('我联网了');
          }

     },
     jyHistory: function(e) {
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
               url: app._server + '/users/getBorrowsHistory',
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
                              key: 'borrowshis',
                              data: res.data
                         })

                         wx.hideLoading();
                         wx.showToast({
                              title: '获取历史成功',
                              icon: 'success',
                              duration: 2000,
                              complete: function() {

                              } //接口调用结束的回调函数
                         });
                    } else {
                         wx.hideLoading();
                         app.showErrorModal('可能是网络出了点问题', '失败了');
                    }


               },
               fail: function(res) {
                    wx.hideLoading();
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
          this.getBorrows(function() {
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