const db = wx.cloud.database({
  env: 'eqp-14a8fd'
})
Page({

  data: {
    howto: '',
    name: '',
    img: [],
    data: {},
    type_hidden: true,
    keyboard: false,
    userName: '',
    discussData: [],
    select_items: [],
    howToID: '',
    value:'',
  },

  typeIn: function() {
    this.setData({
      type_hidden: false,
      keyboard: 'true',
    })
  },

  confirm: function(e) {
    var that = this
    that.setData({
      discussData: that.data.discussData.concat(that.data.userName + ':' + e.detail.value.typeData)
    })
    wx.cloud.callFunction({
      name: 'insert_comment',
      data: {
        _id: that.data.howToID,
        comment: that.data.discussData
      },
      success(res) {
        that.setData({
          type_hidden: true,
          value:'',
        })
      }
    })
  },
  deleteTypeIn: function(e) {
    console.log(e)
    var that = this
    var userName = e.currentTarget.id.split(':')
    console.log(userName[0])
    if (userName[0] == that.data.userName) {//判断是否是自己的留言
      var index = that.data.discussData.indexOf(e.currentTarget.id)
      var discussData = that.data.discussData
      discussData.splice(index, 1)
      wx.cloud.callFunction({
        name: 'insert_comment',
        data: {
          _id: that.data.howToID,
          comment: discussData
        },
        success(res) {
          that.setData({ discussData: discussData})
        }
      })
    } else {
      wx.showToast({
        title: '请勿删除他人留言',
        icon: 'none',
        duration: 1000,
      })
    }
  },
  type_cancel: function() {
    this.setData({
      type_hidden: 'true'
    })
  },

  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'name',
      success: function(res) {
        console.log(res)
        that.setData({
          userName: res.data
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onShow: function() {
    var that = this
    wx.getStorage({
      key: 'howto',
      success: function(num) {
        if (num.data != that.data.howto) {
          that.setData({
            howto: num.data
          })
          // 测试云存储读取图片
          wx.cloud.downloadFile({
            fileID: 'cloud://eqp-14a8fd.6571-eqp-14a8fd/howTo/' + num.data + '/' + num.data + '-1.jpg',
            success: res => {
              console.log(res.tempFilePath)
              var data = res.tempFilePath
              that.setData({
                'img[0]': data
              })
            },
            fail: console.error
          })
          wx.cloud.downloadFile({
            fileID: 'cloud://eqp-14a8fd.6571-eqp-14a8fd/howTo/' + num.data + '/' + num.data + '-2.jpg',
            success: res => {
              var data = res.tempFilePath
              that.setData({
                'img[1]': data
              })
            },
            fail: console.error
          })
          wx.cloud.downloadFile({
            fileID: 'cloud://eqp-14a8fd.6571-eqp-14a8fd/howTo/' + num.data + '/' + num.data + '-3.jpg',
            success: res => {
              var data = res.tempFilePath
              that.setData({
                'img[2]': data
              })
            },
            fail: console.error
          })
          const db = wx.cloud.database({
            env: 'eqp-14a8fd'
          })
          db.collection('HowTo').where({
            num: num.data
          }).get({
            success(res) {
              console.log(res)
              if (res.data.length == 0) {
                wx.showModal({
                  title: '温馨提示：',
                  content: '暂时没有该设备的教程，\n需要请呼叫Andy，谢谢！',
                  showCancel: true,
                  cancelColor: '#5b5b5b',
                  cancelText: '才不！',
                  confirmText: '呼叫！',
                  confirmColor: '#ff6369',
                  success: function(res) {
                    if (res.confirm) {
                      wx.makePhoneCall({
                        phoneNumber: '13959177731'
                      })
                    } else {
                      wx.switchTab({
                        url: '../index/index'
                      })
                    }
                  }
                })
              } else {
                wx.setNavigationBarTitle({
                  title: res.data[0].dq_num + '的使用方法'
                })
                var discussData = []
                console.log(res.data[0].comment)
                if (res.data[0].comment != null) {
                  that.setData({
                    discussData: res.data[0].comment
                  })
                } else {
                  that.setData({
                    discussData: []
                  })
                }
                that.setData({
                  data: res.data[0],
                  howToID: res.data[0]._id
                })
              }
            }
          })
        }

      },
      fail: function(res) {
        wx.showModal({
          title: '温馨提示：',
          content: '想看什么教程，去主页搜索！',
          showCancel: false,
          confirmText: '搜索走起',
          confirmColor: '#ff6369',
          cancelColor: '#5b5b5b',
          success: function(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index'
              })
            }
          },
        })
      }
    })
  },
  onPullDownRefresh: function() {
    var that = this
    wx.stopPullDownRefresh()
  }
})