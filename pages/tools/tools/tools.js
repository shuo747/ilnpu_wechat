//index.js
//获取应用实例
var app = getApp();
Page({
     data: {
          cores: [
               [{

                         id: 'cj',
                    path: '../gradesearch/gradesearch',
                         name: '成绩查询(test)',
                         disabled: true,
                         teacher_disabled: true,
                         offline_disabled: false
                    }
                  ,
                    {
                         id: 'kjs',
                         path: '../search/xs/xs',
                         name: '教室',
                         disabled: true,
                         teacher_disabled: false,
                         offline_disabled: false
                    }
                      /*,

                    {
                         id: 'jy',
                         path: '../core/jy/jy',
                         name: '借阅信息',
                         disabled: true,
                         teacher_disabled: false,
                         offline_disabled: false
                    },
                    {
                         id: 'kjs',
                         path: '../search/kjs/kjs',
                         name: '空教室',
                         disabled: false,
                         teacher_disabled: false,
                         offline_disabled: true
                    },
                    {
                         id: 'xs',
                         path: '../search/xs/xs',
                         name: '学生查询',
                         disabled: false,
                         teacher_disabled: false,
                         offline_disabled: true
                    },
                    {
                         id: 'ykt',
                         path: '../core/ykt/ykt',
                         name: '一卡通',
                         disabled: false,
                         teacher_disabled: false,
                         offline_disabled: false
                    },
                    {
                         id: 'ks',
                         path: '../core/ks/ks',
                         name: '考试安排',
                         disabled: true,
                         teacher_disabled: false,
                         offline_disabled: false
                    },
                    {
                         id: 'news',
                         path: '../core/news/news',
                         name: '校园通知',
                         disabled: false,
                         teacher_disabled: true,
                         offline_disabled: false
                    }
                    */
               ]
          ]
     },
     //data end


     //分享
     onShareAppMessage: function() {
          return {
               title: 'ilnpu',
               desc: '碎片化、一站式、一体化校园移动门户',
               path: '/pages/index/index'
          };
     },
     onLoad: function() {
       
     },
     disabled_item: function(event) {
         
               var page = event.currentTarget.dataset.page;
               wx.navigateTo({
                    url: page
               })
          
     },
     showErrorModal: function(content, title) {
          wx.showModal({
               title: title || '加载失败',
               content: content || '未知错误',
               showCancel: false
          });
     },

     /*
     getCardData: function() {
          var _this = this;
          //判断并读取缓存
          if (app.cache.kb) {
               kbRender(app.cache.kb);
          }
          if (app.cache.ykt) {
               yktRender(app.cache.ykt);
          }
          if (app.cache.sdf) {
               sdfRender(app.cache.sdf);
          }
          if (app.cache.jy) {
               jyRender(app.cache.jy);
          }
          if (_this.data.offline) {
               return;
          }
          wx.showNavigationBarLoading();

          //课表渲染
          function kbRender(info) {
               var today = parseInt(info.day),
                    lessons = info.lessons[today === 0 ? 6 : today - 1], //day为0表示周日(6)，day为1表示周一(0)..
                    list = [],
                    time_list = _this.data.card.kb.time_list;
               for (var i = 0; i < 6; i++) {
                    for (var j = 0; j < lessons[i].length; j++) {
                         var lesson = lessons[i][j];
                         if (lesson.weeks && lesson.weeks.indexOf(parseInt(info.week)) !== -1) {
                              var begin_lesson = 2 * i + 1,
                                   end_lesson = 2 * i + lesson.number;
                              list.push({
                                   when: begin_lesson + ' - ' + end_lesson + '节' +
                                        '（' + time_list[begin_lesson - 1].begin + '~' + time_list[end_lesson - 1].end + '）',
                                   what: lesson.name,
                                   where: lesson.place.trim()
                              });
                         }
                    }
               }
               _this.setData({
                    'card.kb.data': list,
                    'card.kb.show': true,
                    'card.kb.nothing': !list.length,
                    'remind': ''
               });
          }
          //获取课表数据
          var kb_data = {
               id: app._user.we.info.id,
          };
          if (app._user.teacher) {
               kb_data.type = 'teacher';
          }
          var loadsum = 0; //正在请求连接数
          loadsum++; //新增正在请求连接
          wx.request({
               url: app._server + '/api/get_kebiao.php',
               method: 'POST',
               data: app.key(kb_data),
               success: function(res) {
                    if (res.data && res.data.status === 200) {
                         var info = res.data.data;
                         if (info) {
                              //保存课表缓存
                              app.saveCache('kb', info);
                              kbRender(info);
                         }
                    } else {
                         app.removeCache('kb');
                    }
               },
               complete: function() {
                    loadsum--; //减少正在请求连接
                    if (!loadsum) {
                         if (_this.data.remind == '加载中') {
                              _this.setData({
                                   remind: '首页暂无展示'
                              });
                         }
                         wx.hideNavigationBarLoading();
                         wx.stopPullDownRefresh();
                    }
               }
          });

          //一卡通渲染
          function yktRender(list) {
               if (list.length > 0) {
                    var last = list[0],
                         last_time = last.time.split(' ')[0],
                         now_time = app.util.formatTime(new Date()).split(' ')[0];
                    //筛选并计算当日消费（一卡通数据有一定延迟，无法成功获取到今日数据，主页卡片通常不能展示）
                    for (var i = 0, today_cost = [], cost_total = 0; i < list.length; i++) {
                         if (list[i].time.split(' ')[0] == now_time && list[i].cost.indexOf('-') == 0) {
                              var cost_value = Math.abs(parseInt(list[i].cost));
                              today_cost.push(cost_value);
                              cost_total += cost_value;
                         }
                    }
                    if (today_cost.length) {
                         _this.setData({
                              'card.ykt.data.today_cost.value': today_cost,
                              'card.ykt.data.today_cost.total': cost_total,
                              'card.ykt.data.cost_status': true
                         });
                    }
                    _this.setData({
                         'card.ykt.data.last_time': last_time,
                         'card.ykt.data.balance': parseFloat(last.balance),
                         'card.ykt.show': true,
                         'remind': ''
                    });
               }
          }
          //获取一卡通数据
          loadsum++; //新增正在请求连接
          wx.request({
               url: app._server + '/api/get_yktcost.php',
               method: 'POST',
               data: app.key({
                    yktID: app._user.we.ykth
               }),
               success: function(res) {
                    if (res.data && res.data.status === 200) {
                         var list = res.data.data;
                         if (list) {
                              //保存一卡通缓存
                              app.saveCache('ykt', list);
                              yktRender(list);
                         }
                    } else {
                         app.removeCache('ykt');
                    }
               },
               complete: function() {
                    loadsum--; //减少正在请求连接
                    if (!loadsum) {
                         if (_this.data.remind) {
                              _this.setData({
                                   remind: '首页暂无展示'
                              });
                         }
                         wx.hideNavigationBarLoading();
                         wx.stopPullDownRefresh();
                    }
               }
          });

          //水电费渲染
          function sdfRender(info) {
               _this.setData({
                    'card.sdf.data.room': info.room.split('-').join('栋'),
                    'card.sdf.data.record_time': info.record_time.split(' ')[0].split('/').join('-'),
                    'card.sdf.data.cost': info.elec_cost,
                    'card.sdf.data.spend': info.elec_spend,
                    'card.sdf.show': true,
                    'remind': ''
               });
          }
          if (!!app._user.we.room && !!app._user.we.build) {
               //获取水电费数据
               loadsum++; //新增正在请求连接
               wx.request({
                    url: app._server + '/api/get_elec.php',
                    method: 'POST',
                    data: app.key({
                         buildingNo: app._user.we.build,
                         floor: app._user.we.room.slice(0, 1),
                         room: parseInt(app._user.we.room.slice(1))
                    }),
                    success: function(res) {
                         if (res.data && res.data.status === 200) {
                              var info = res.data.data;
                              if (info) {
                                   //保存水电费缓存
                                   app.saveCache('sdf', info);
                                   sdfRender(info);
                              }
                         } else {
                              app.removeCache('sdf');
                         }
                    },
                    complete: function() {
                         loadsum--; //减少正在请求连接
                         if (!loadsum) {
                              if (_this.data.remind) {
                                   _this.setData({
                                        remind: '首页暂无展示'
                                   });
                              }
                              wx.hideNavigationBarLoading();
                              wx.stopPullDownRefresh();
                         }
                    }
               });
          }

          //借阅信息渲染
          function jyRender(info) {
               if (parseInt(info.books_num) && info.book_list && info.book_list.length) {
                    var nowTime = new Date().getTime();
                    info.book_list.map(function(e) {
                         var oDate = e.yhrq.split('-'),
                              oTime = new Date(oDate[0], oDate[1] - 1, oDate[2]).getTime();
                         e.timing = parseInt((oTime - nowTime) / 1000 / 60 / 60 / 24);
                         return e;
                    });
                    _this.setData({
                         'card.jy.data': info,
                         'card.jy.show': true,
                         'remind': ''
                    });
               }
          }
          //获取借阅信息
          loadsum++; //新增正在请求连接
          wx.request({
               url: app._server + "/api/get_books.php",
               method: 'POST',
               data: app.key({
                    ykth: app._user.we.ykth
               }),
               success: function(res) {
                    if (res.data && res.data.status === 200) {
                         var info = res.data.data;
                         if (info) {
                              //保存借阅缓存
                              app.saveCache('jy', info);
                              jyRender(info);
                         }
                    } else {
                         app.removeCache('jy');
                    }
               },
               complete: function() {
                    loadsum--; //减少正在请求连接
                    if (!loadsum) {
                         if (_this.data.remind) {
                              _this.setData({
                                   remind: '首页暂无展示'
                              });
                         }
                         wx.hideNavigationBarLoading();
                         wx.stopPullDownRefresh();
                    }
               }
          });
     }

     */
});