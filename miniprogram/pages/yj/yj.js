const db = wx.cloud.database()
var app = getApp()
Page({
  data: {
    name: '',
    work: '',
    openID:'',
  },
  formSubmit: function (e) {
    var that = this
    var name = e.detail.value.name;
    var work = that.data.work;
    that.setData({
      name: name,
    });
    if (that.data.openID == 'opQ1V43pulrAvXkbMMJjE6qR6_Yw') {
      console.log('是老板的微信要登录，登录什么名字都可以！！')
      wx.setStorage({
        key: "name",
        data: name,
      });
      wx.switchTab({
        url: '../index/index'
      })
    } else {
    db.collection('Users').where({
      openID : that.data.openID 
    }).get({
      success: function (res) {
        if(res.data.length == 0){
          db.collection('Users').where({
            user_name : name
          }).get({
            success: function (res) {
              if (res.data.length == 0) {
                wx.cloud.callFunction({
                  name: 'user_update',
                  data: {
                    user_name: name,
                    openID: that.data.openID
                  },
                  success: res => {
                    console.log('用户添加成功')
                    wx.setStorage({
                      key: "user",
                      data: name,
                    });
                    wx.switchTab({
                      url: '../index/index'
                    })
                  }
                })
              }
              else {
                wx.showToast({
                  title: '这不是' + name + '的微信哟。',
                  icon: 'none',
                  duration: 1000,
                })
              }
            }
          })
        }
        else{
          if (res.data[0].user_name == name) {
            wx.setStorage({
              key: "user",
              data: name,
            });
            wx.switchTab({
              url: '../index/index'
            })
          }
          else{
            wx.showToast({
              title: res.data[0].user_name + '，名字可能输错咯~',
              icon: 'none',
              duration:1000,
            })
          }
        }
      },
      fail: function(res){
        console.log(res.data)
      }
    })
    }
  },

  onLoad: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res.result.openid)
        that.setData({ openID: res.result.openid })
        wx.setStorage({
          key: "openID",
          data: res.result.openid,
        });
      },
      fail: err => {
        console.error(err)
      }
    })
  },
})