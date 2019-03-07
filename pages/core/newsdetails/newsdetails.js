var WxParse = require('../../../wxParse/wxParse.js');
Page({

     /**
      * 页面的初始数据
      */
     data: {
          article:{}
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function(options) {

          console.log("接收到的参数是index=" + options.index);
          var index = options.index;
          //var index = 5;

          var that = this;
          wx.setNavigationBarTitle({
               title: wx.getStorageSync('news')[index].title
          })
          var article = ``;
          article = wx.getStorageSync('news')[index].artical;
          //console.log(wx.getStorageSync('news')[index]);
          //var article = '<div>我是HTML代码</div>';
          WxParse.wxParse('article', 'html', article, that, 5);

     }
})