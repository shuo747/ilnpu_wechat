//app.js
const moment = require('/utils/moment.min.js');
App({
     version: '1.1.0 beta1', //版本号
     startWeekStr : '2019-02-25',//学期起始日期字符串
     startWeek: {},
     onLaunch: function() {
          this.startWeek = moment(this.startWeekStr).isoWeek();
          var _this = this;
          var data = wx.getStorageInfoSync();
          console.log(data);

          //遍历缓存，存储到app以备使用
          for (var index in data.keys) {
               _this.cache[data.keys[index]] = wx.getStorageSync(data.keys[index]);
          }
          try {
               _this.wxuser = _this.cache.wxuser;
               _this.stu = _this.cache.stu;
               _this.user = _this.cache.userinfo.userInfo;
          } catch (e){}
          console.log("_this.cache");
          console.log(_this.cache);
          this.getUserInfo();
          //this.cache.courses = {};
          this.cache.grades = null;
          this.cache.exam = null;
          this.cache.news = {};
          this.cache.borrowshis = {};
          //this.cache.news = {};

          console.log("_this.cache");
          console.log(_this.cache);
     },
     //后台切换至前台时
     onShow: function() {

     },
     //判断是否有登录信息，让分享时自动登录
     loginLoad: function(onLoad) {
          var _this = this;
          /*
          if (!_this._t) { //无登录信息
               _this.getUser(function(e) {
                    typeof onLoad == "function" && onLoad(e);
               });
          } else { //有登录信息
               typeof onLoad == "function" && onLoad();
          }
          */
     },
     getUserInfo: function() {
          var _this = this;
          //获取微信用户信息
          wx.getUserInfo({
               success: function(res) {
                    console.log("成功微信用户信息------");
                    console.log(res);
                    wx.setStorage({
                         key: 'userinfo',
                         data: res,
                    });
                    _this.user = res.userInfo;

               },
               fail: function(res) {
                    _this.showErrorModal('需要授权！请点击主页开启按钮授权，即可开启ilnpu', '提示');
               }
          });
     },

     showErrorModal: function(content, title) {
          wx.showModal({
               title: title || '加载失败',
               content: content || '未知错误',
               showCancel: false
          });
     },
     showLoadToast: function(title, duration) {
          wx.showToast({
               title: title || '加载中',
               icon: 'loading',
               mask: true,
               duration: duration || 10000
          });
     },
     util: require('./utils/util'),
     key: function(data) {
          return this.util.key(data)
     },
     enCodeBase64: function(data) {
          return this.util.base64.encode(data)
     },
     user: {},
     wxuser: {},
     cache: {},
     stu: {},
     basicdata: {},

     //_server: 'https://wx.shuo747.com/2',
     //_server: 'https://59.110.212.119',
    _server: 'http://localhost:1433/2',
     _user: {
          //微信数据
          wx: {},
          //学生\老师数据
          we: {}
     },
     _time: {} //当前学期周数
});