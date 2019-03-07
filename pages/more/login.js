//login.js
//获取应用实例
var app = getApp();
Page({
     data: {
          remind: '加载中',
          help_status: false,
          userid_focus: false,
          passwd_focus: false,
          userid: '',
          passwd: '',
          angle: 0
     },
     onReady: function() {
          var _this = this;
          setTimeout(function() {
               _this.setData({
                    remind: ''
               });
          }, 1000);
          wx.onAccelerometerChange(function(res) {
               var angle = -(res.x * 30).toFixed(1);
               if (angle > 14) {
                    angle = 14;
               } else if (angle < -14) {
                    angle = -14;
               }
               if (_this.data.angle !== angle) {
                    _this.setData({
                         angle: angle
                    });
               }
          });
     },
     onLoad: function() {


     },

     bind: function() {
          //app.saveCache('test', 'tdata');
          var _this = this;
          if (!_this.data.userid || !_this.data.passwd) {
               app.showErrorModal('账号及密码不能为空', '提醒');
               return false;
          }
          

          wx.showLoading({
               title: '绑定中',
               mask: true
          })
          console.log(app._user);
          var pages = getCurrentPages();
          var Page = pages[pages.length - 1]; //当前页
          var prevPage = pages[pages.length - 2]; //上一个页面
          var prevPrevPage = pages[pages.length - 3]; //上上一个页面

          
          wx.request({
               method: 'POST',
               url: app._server + '/users/bindandgetstu',
               data: {
                    openid: app.wxuser.openid,
                    sid: _this.data.userid,
                    password: _this.data.passwd
               },
               header: {
                    "Content-Type": "application/x-www-form-urlencoded"
               },
               success: function(res) {
                    console.log(res);
                    wx.hideLoading();

                    //if(res.data.s)
                    console.log(res.data);
                    if (res.data.res === 1) {

                         console.log('打印上一页面');
                         console.log(prevPage);

                         app.stu = res.data.stu;
                         app.wxuser = res.data.wxuser;
                         prevPage.setData({
                              stu: res.data.stu,
                              wxuser: res.data.wxuser,
                              remind: ''
                         });

                         try {
                              prevPage.setData({
                                   courses: res.data.courses
                              })
                         } catch (e) {}


                         try {
                              prevPrevPage.setData({
                                   stu: res.data.stu,
                                   wxuser: res.data.wxuser,
                                   remind: '',
                                   courses: res.data.courses
                              });
                         } catch (e) {}

                         wx.setStorage({
                              key: 'wxuser',
                              data: res.data.wxuser,
                         });
                         wx.setStorage({
                              key: 'stu',
                              data: res.data.stu,
                         });
                         wx.setStorage({
                              key: 'courses',
                              data: res.data.courses,
                         })

                         wx.showToast({
                              title: '绑定成功',
                              icon: 'success',
                              duration: 2000,
                              complete: function() {

                              } //接口调用结束的回调函数
                         });

                         wx.navigateBack({
                              delta: 1,
                         })

                    } else {
                         wx.showToast({
                              title: '密码错误,绑定失败了',
                              icon: 'none',
                              duration: 2000
                         });

                    }



                    

               },
               fail: function(res) {
                    app.showErrorModal('可能是网络出了点问题', '绑定失败');
               },
               complete: function() {
                    wx.hideLoading();
                    //wx.hideLoading();
               }
          });
     },
     useridInput: function(e) {
          this.setData({
               userid: e.detail.value
          });
          if (e.detail.value.length >= 10) {
               wx.hideKeyboard();
          }
     },
     passwdInput: function(e) {
          this.setData({
               passwd: e.detail.value
          });
     },
     inputFocus: function(e) {
          if (e.target.id == 'userid') {
               this.setData({
                    'userid_focus': true
               });
          } else if (e.target.id == 'passwd') {
               this.setData({
                    'passwd_focus': true
               });
          }
     },
     inputBlur: function(e) {
          if (e.target.id == 'userid') {
               this.setData({
                    'userid_focus': false
               });
          } else if (e.target.id == 'passwd') {
               this.setData({
                    'passwd_focus': false
               });
          }
     },
     tapHelp: function(e) {
          if (e.target.id == 'help') {
               this.hideHelp();
          }
     },
     showHelp: function(e) {
          this.setData({
               'help_status': true
          });
     },
     hideHelp: function(e) {
          this.setData({
               'help_status': false
          });
     }
});