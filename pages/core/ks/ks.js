//ks.js
//获取应用实例
var app = getApp();
const moment = require('../../../utils/moment.min.js');
Page({
     data: {
          stu: {},
          exam: {},
          remind: ''
     },
     onLoad: function () {

          var _this = this;
          //this.grades = wx.getStorageSync('grades')

/*
          console.log(moment("2018-08-20").isoWeek());
          console.log(moment("2018-11-19").isoWeek());
          console.log(moment().isoWeek());

          console.log('app');
          console.log(app.startWeek);
          */


          this.setData({
               stu: app.stu,
               exam: wx.getStorageSync('exam')
          })
          if (wx.getStorageSync('exam')) {
               console.log('我没联网');
          }
          else {
               
               this.getExam();
               console.log('我联网了');
          }
          if (!app.wxuser.sid) {
               _this.setData({
                    remind: '未绑定,回到首页绑定吧'
               });
               return false;
          }


          console.log('app');
          console.log(moment().weekday());
          console.log(app.stu.sclass.replace(/\s+/g, ''));
     },
     onPullDownRefresh: function () {
          this.getExam();
          wx.stopPullDownRefresh();//关闭下拉刷新
     },
     getExam: function () {
          var _this = this;
          wx.showLoading({
               title: '获取考试中',
               mask: true
          })
          wx.request({
               method: 'POST',
               url: app._server + '/users/getExam',
               //url: 'http://localhost:1433/r',
               data: {
                    sid: app.wxuser.sid,
                    sclass: app.stu.sclass.replace(/\s+/g, '')
               },
               header: {
                    "Content-Type": "application/x-www-form-urlencoded"
               },
               success: function (res) {

                    if (res.statusCode == 200) {
                         console.log(res);
                         wx.hideLoading();

                         _this.setData({
                              exam: res.data

                         })
                         wx.setStorage({
                              key: 'exam',
                              data: res.data
                         })
                         wx.showToast({
                              title: '获取考试成功',
                              icon: 'success',
                              duration: 2000,
                              complete: function () {

                              } //接口调用结束的回调函数
                         });
                    } else {
                         app.showErrorModal('可能是网络出了点问题', '失败了');
                         wx.hideLoading();
                    }


               },
               fail: function (res) {
                    wx.hideLoading();
                    app.showErrorModal('可能是网络出了点问题', '失败了');
               },
               complete: function () {

               }
          });
     }
});