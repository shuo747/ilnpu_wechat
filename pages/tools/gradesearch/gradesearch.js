//xs.js
//获取应用实例
var app = getApp();

Page({
     data: {
          header: {
               defaultValue: '',
               inputValue: '',
               help_status: false
          },
          main: {
               mainDisplay: true, // main 显示的变化标识
               total: 0,
               sum: 0,
               page: 0,
               message: '上滑加载更多'
          },
          testData: [],
          messageObj: { // 查询失败的提示信息展示对象
               messageDisplay: true,
               message: ''
          }
     },

     onLoad: function (options) {

          console.log("接收到的参数是sid=" + options.sid);
          var sid = options.sid;
          this.setData({
               inputValue : sid
         })
     },

     bindClearSearchTap: function(e) {
          this.setData({
               'main.mainDisplay': true,
               'main.total': 0,
               'main.sum': 0,
               'main.page': 0,
               'main.message': '上滑加载更多',
               'testData': [],
               'header.inputValue': ''
          });
     },

     bindSearchInput: function(e) {
          this.setData({
               'header.inputValue': e.detail.value,
               'main.total': 0,
               'main.sum': 0,
               'main.page': 0,
               'main.message': '上滑加载更多',
               'testData': []
          });
          if (!this.data.messageObj.messageDisplay) {
               this.setData({
                    'messageObj.messageDisplay': true,
                    'messageObj.message': ''
               });
          }
          return e.detail.value;
     },

     // 点击搜索
     bindConfirmSearchTap: function() {
          this.setData({
               'main.total': 0,
               'main.sum': 0,
               'main.page': 0,
               'main.message': '上滑加载更多',
               'testData': []
          });
          this.search();
     },

     // 上滑加载更多
     /*
     onReachBottom: function() {
          if (this.data.main.message != '已全部加载' && this.data.main.message != '正在加载中') {
               this.search();
          }
     },

     */

     // 搜索
     search: function(key) {
          var that = this,
               inputValue = key || that.data.header.inputValue,
               messageDisplay = false,
               message = '',
               reDdata = null,
               numberSign = false; // 用户输入的是姓名还是学号的标识

          // 消除字符串首尾的空格
          function trim(str) {
               return str.replace(/(^\s*)|(\s*$)/g, '');
          }

          inputValue = trim(inputValue);

          // 抽离对messageObj的设置成一个单独的函数
          function setMessageObj(messageDisplay, message) {

               that.setData({
                    'messageObj.messageDisplay': messageDisplay,
                    'messageObj.message': message
               });
          }

          // 对输入的是空格或未进行输入进行处理
          if (inputValue === '') {

               this.setData({
                    'main.mainDisplay': true
               });

               return false;
          }

          // 防止注入攻击
          function checkData(v) {

               var temp = v;

               v = v.replace(/\\|\/|\.|\'|\"|\<|\>/g, function(str) {
                    return '';
               });
               v = trim(v);

               messageDisplay = v.length < temp.length ? false : true;
               message = '请勿输入非法字符!';

               return v;
          }

          wx.navigateTo({
               url: 'gradeinfo?sid=' + inputValue,
          }) 

     },

     
     tapHelp: function(e) {
          if (e.target.id == 'help') {
               this.hideHelp();
          }
     },
     showHelp: function(e) {
          this.setData({
               'header.help_status': true
          });
     },
     hideHelp: function(e) {
          this.setData({
               'header.help_status': false
          });
     }
});