//more.js
//获取应用实例
var app = getApp();
const moment = require('../../utils/moment.min.js');
Page({
     data: {
          is_bind: true,
          wxuser: {},
          user: {},
          stu: {},
          currentWeekOfYear: moment().isoWeek(),
          startWeekOfYear: app.startWeek,
     },
     onShow: function() {
          //console.log(user);
          this.setData({
               currentWeekOfYear: moment().isoWeek(),
               startWeekOfYear: app.startWeek,
               user: app.user,
               stu: app.stu
               //hasUserInfo: true
          })
     },
     onLoad: function() {
          this.setData({
               user: app.user,
               stu: app.stu
               //hasUserInfo: true
          })
     },
     changeData: function(name) {
          this.setData({
               name: name
          })
     },
     copyQQGroup: function(e) {
          var self = this;
          wx.setClipboardData({
               data: '226949899',
               success: function(res) {
                    // self.setData({copyTip:true}),
                    wx.showModal({
                         title: '提示',
                         content: '群号已复制到剪切板',
                         success: function(res) {
                              if (res.confirm) {
                                   console.log('确定')
                              } else if (res.cancel) {
                                   console.log('取消')
                              }
                         }
                    })
               }
          });
     }


});