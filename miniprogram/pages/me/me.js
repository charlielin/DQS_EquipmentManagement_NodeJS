var user = ''
var app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    equipment_list: [],
  },
  return_equipment: function (e) {
    // var that = this
    // var index = e.currentTarget.id
    // var _id = that.data.equipment_list[index]._id
    // wx.cloud.callFunction({
    //   name: 'update_position',
    //   data: {
    //     _id: _id,
    //     position: '仪表间',
    //     user: '陈露',
    //     time: that.time_now()
    //   },
    //   success: function (result) {
    //     that.refresh_list()
    //   },
    //   fail: function (result) {
    //     console.log(result)
    //   }
    // })
  },
  refresh_list: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'query_equipment_info',
      data: {
        search_item: 'user',
        search_content: user
      }
    }).then(res => {
      console.log(res.result.data)
      that.setData({
        equipment_list: res.result.data
      })
    })
  },
  my_story: function () {
    wx.navigateTo({
      url: '../test/test',
    })
  },
  reset: function () {
    wx.clearStorage()
    wx.reLaunch({
      url: '../yj/yj',
    })
  },
  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'name',
      success: function (res) {
        user = res.data
        that.refresh_list()
      },
    });
  },
  
  time_now: function () {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    var time = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
    var date = Y + "年" + M + "月" + D + "日"
    console.log(time, date);
    return time;
  },
})