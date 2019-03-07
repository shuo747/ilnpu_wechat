//index.js
//获取应用实例
var app = getApp()
const moment = require('../../../utils/moment.min.js');
Page({
     data: {
          showModal: false,
          modalData: {},
          currentWeekOfYear: moment().isoWeek(),
          selectWeek: {},
          currentWeek: {},
          startWeekOfYear: app.startWeek,
          scroll_height: 1170,
          dates: {},
          courses: {},
          lessons: {},

          _weeks: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周', '第八周', '第九周', '第十周', '十一周', '十二周', '十三周', '十四周', '十五周', '十六周', '十七周', '十八周', '十九周', '二十周'],

     },
     onLoad: function() {
          console.log('onLoad');
          var _this = this;
          /*
          this.setData({
               courses: app.cache.courses
          })
          */
          let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
          let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
          currentWeekOfYear: moment().isoWeek()
          this.setData({
               scroll_height: windowHeight * 750 / windowWidth - 70 - 90
          })
          this.lessons = wx.getStorageSync('courses');
          this.ss();
          this.setData({
               //currentWeek: _currentWeekOfYear,
               selectWeek: _this.data.currentWeekOfYear - _this.data.startWeekOfYear,
               currentWeek: _this.data.currentWeekOfYear - _this.data.startWeekOfYear
          })
          if (_this.data.currentWeekOfYear - _this.data.startWeekOfYear<0){
               _this.setData({
                    //currentWeek: _currentWeekOfYear,
                    selectWeek: 0,
                    currentWeek: 0
               })
          }
          if (_this.data.currentWeekOfYear - _this.data.startWeekOfYear > 19) {
               _this.setData({
                    //currentWeek: _currentWeekOfYear,
                    selectWeek: 19,
                    currentWeek: 19
               })
          }
          this.selectWeek = 0;
          
     },
     //左右按钮点击事件
     swiperChangeBtn: function(e) {
          var _this = this;
          var dataset = e.currentTarget.dataset,
               i, data = {};
          if (dataset.direction == 'left') {
               i = -1;
          } else if (dataset.direction == 'right') {
               i = 1;
          }
          console.log(e);
          var data = dataset.target + i;
          if (data < 1 || data > 20)
               return;
          _this.setData({
               selectWeek: data
          })

     },
     //底部滑动事件
     currentChange: function(e) {
          // 更改底部周数时触发，修改当前选择的周数
          console.log(e);
          var current = e.detail.current;
          if (current < 0 || current > 20)
               return;
          this.setData({
               selectWeek: current
          });
     },
     returnCurrent: function() {
          //返回本周
          this.setData({
               selectWeek: this.data.currentWeek
          });
     },
     //显示详情
     showCardView: function(event) {
          console.log(event)
          var info = event.currentTarget.dataset;
          this.setData({
               showModal : true,
               modalData: {
                    name: info.name,
                    tname: info.tname,
                    week: info.week,
                    times:info.times,
                    room: info.room,
                    color: info.color
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

     ss: function() {
          var colorArrays = new Array("#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#6699CC", "#12AEF3", "#E29AAD", "#61BC69", "#993366", "#CCCCFF", "#FF9933"
          //怕颜色不够所以又复制一遍
          ,"#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#6699CC", "#12AEF3", "#E29AAD", "#61BC69", "#993366", "#CCCCFF", "#FF9933"
          );
          var _lessons = wx.getStorageSync('courses')
          //颜色指针，
          var index = 0;
          var i, ilen, j, jlen, k, klen;
          //已上色的课程，以name属性区分
          var complete = new Array();
          for (i = 0, ilen = _lessons.length; i < ilen; i++) {
               for (j = 0, jlen = _lessons[i].length; j < jlen; j++) {
                    for (k = 0, klen = _lessons[i][j].length; k < klen; k++) {
                         if (_lessons[i][j][k]) {
                              var res = complete.indexOf(_lessons[i][j][k].name);
                              //查看是否已上色，若上色则获取上色的索引
                              if (res > -1) {
                                   _lessons[i][j][k].color = colorArrays[res];
                              }
                              //未上色则上色，分配颜色，指针移动
                              else {
                                   _lessons[i][j][k].color = colorArrays[index];
                                   complete.push(_lessons[i][j][k].name);
                                   index++;
                              }
                         }
                    }
               }
          }



          this.setData({
               lessons: _lessons
          })

          var dates = new Array();
          var i, ilen, j, jlen, k, klen;
          var index = 0;
          for (i = 0; i < 20; i++) {
               dates[i] = new Array();
               for (j = 0; j < 7; j++) {
                    var item = new Object();
                    var data = moment(app.startWeekStr).add('days', index);
                    item.year = data.get('year');
                    item.month = data.get('month') + 1; // 0 to 11
                    item.date = data.get('date');
                    dates[i].push(item);
                    //console.log('----');
                    index++;

               }
          }
          this.setData({
               dates: dates
          })



     }

});