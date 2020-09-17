const db = wx.cloud.database({
  env: 'eqp-14a8fd'
})
Page({
  data: {
    tempFilePath: '',
    chooseL: [
      ['105', '107', '全压', '寿命1', '寿命2', '寿命3', '120kA', '多磁路', '控制室', '防尘', '一楼防水', '10kA', '50kA', '成套综合', '成套温升', '直流', '充电桩', '阻抗室', '仓库'],
      ['202', '204', '介电性能', 'F204', '双电源', '材料试验', '接近开关', '辅助触头', '环境', '仪表间', ],
      ['28周期', '三楼防水', '元件室', '成套室', '自用', '送计量', '监督抽查'],
      ['副所长', '业务室', '项目室', '管理室', '会议室', '小会议室', '业务接待', '开水间', '资料室', ]
    ],
    type_hidden: true,
    typeE_hidden: true,
    chooseL_hidden: true,
    dataWindow_hidden: true,
    moreWindow_hidden: true,
    labMore_hidden: true,
    eqpMore_hidden: true,
    scanUpdateWindow_hidden: true,
    value: '',
    type_value: '',
    num_keyboard: false,
    text_keyboard: false,
    num: '',
    data: {},
    userName: '',
    labName: '',
    eqpName: '',
    lab: [],
    eqp: [],
    more: [],
    scanResult: '',
    scanEqp: '',
    scanID: '',
  },

  confirm: function (e) {
    var that = this
    this.setData({
      type_hidden: true,
      typeE_hidden: true,
    })
    var that = this
    if (that.data.value == '信息') {
      db.collection('Equipments').where({
        num: db.RegExp({
          regexp: e.detail.value.typeData,
        })
      }).count({
        success(res) {
          console.log(res.total)
          if (res.total <= 1) {
            that.setData({
              dataWindow_hidden: false,
            })
            db.collection('Equipments').where({
              num: db.RegExp({
                regexp: e.detail.value.typeData,
              })
            }).get({
              success(res) {
                console.log(res)
                that.setData({
                  data: res.data[0],
                  num: res.data[0].dq_num
                })
              },
              fail(res) {
                console.log(res.toString)
              }
            })
          } else {
            that.setData({
              moreWindow_hidden: false,
              num: e.detail.value.typeData
            })
            var a = res.total
            var b = a / 20 + 1
            var all = []
            for (var i = 0; i <= b; i++) {
              db.collection('Equipments').where({
                num: db.RegExp({
                  regexp: e.detail.value.typeData,
                })
              }).skip(i * 20).get({
                success(res) {
                  all = all.concat(res.data)
                  console.log(all)
                  var moreData = []
                  if (all.length == a) {
                    for (var j = 0; j < a; j++) {
                      moreData[j] = all[j].dq_num + '   ' + all[j].name + '   ' + all[j].position
                    }
                  }
                  console.log(moreData)
                  that.setData({
                    more: moreData
                  })
                }
              })
            }
          }

        },
        fail(res) {
          console.log(res)
        }
      })

    } else {
      if (that.data.value == '使用方法') {
        wx.setStorageSync('howto', e.detail.value.typeData)
        wx.switchTab({
          url: '../howTo/howTo'
        })
      } else {
        if (that.data.value == '位置') {
          db.collection('Equipments').where({
            name: db.RegExp({
              regexp: e.detail.value.typeData,
            })
          }).count({
            success(res) {
              console.log(res.total)
              if (res.total <= 1) {
                that.setData({
                  dataWindow_hidden: false,
                })
                db.collection('Equipments').where({
                  name: db.RegExp({
                    regexp: e.detail.value.typeData,
                  })
                }).get({
                  success(res) {
                    console.log(res)
                    that.setData({
                      data: res.data[0],
                      num: res.data[0].dq_num
                    })
                  }
                })
              } else {
                that.setData({
                  eqpMore_hidden: false,
                  eqpName: e.detail.value.typeData
                })
                var a = res.total
                var b = a / 20 + 1
                var all = []
                for (var i = 0; i <= b; i++) {
                  db.collection('Equipments').where({
                    name: db.RegExp({
                      regexp: e.detail.value.typeData,
                    })
                  }).skip(i * 20).get({
                    success(res) {
                      all = all.concat(res.data)
                      console.log(all)
                      var moreData = []
                      if (all.length == a) {
                        for (var j = 0; j < a; j++) {
                          moreData[j] = all[j].dq_num + '   ' + all[j].name + '   ' + all[j].position
                        }
                      }
                      console.log(moreData)
                      that.setData({
                        eqp: moreData
                      })
                    }
                  })
                }
              }

            }
          })

        }
      }
    }
  },

  scanUpdate: function (tap) {
    var that = this
    wx.cloud.callFunction({
      name: 'update_position',
      data: {
        _id: that.data.scanID,
        position: tap.currentTarget.id,
        user: that.data.userName,
        time: that.time_now()
      },
      success: function (result) {
        console.log(result)
        that.setData({
            scanUpdateWindow_hidden: true,
          }),
          wx.showToast({
            title: '登记成功！',
            icon: 'success',
            duration: 1000,
            mask: true
          })
      },
      fail: function (result) {
        console.log(result)
      }
    })
  },
  scanInformation: function () {
    var that = this
    that.setData({
      dataWindow_hidden: false,
      scanUpdateWindow_hidden: true,
    })
    db.collection('Equipments').where({
      id: that.data.scanResult
    }).get({
      success(res) {
        console.log(res)
        that.setData({
          data: res.data[0],
          num: res.data[0].dq_num
        })
      }
    })
  },
  scanHowTo: function () {
    var that = this
    db.collection('Equipments').where({
      id: that.data.scanResult
    }).get({
      success(res) {
        console.log(res)
        wx.setStorageSync('howto', res.data[0].num)
        wx.switchTab({
          url: '../howTo/howTo'
        })
      }
    })
  },
  search: function (e) {
    this.setData({
      type_value: '',
      type_hidden: false,
      value: '信息',
      num_keyboard: true
    })
  },
  howTo: function (e) {
    this.setData({
      type_value: '',
      type_hidden: false,
      value: '使用方法',
      num_keyboard: true
    })
  },
  searchE: function (e) {
    this.setData({
      type_value: '',
      typeE_hidden: false,
      chooseE_hidden: true,
      value: '位置',
      text_keyboard: true
    })
  },

  type_cancel: function () {
    this.setData({
      type_hidden: true,
      typeE_hidden: true
    })
  },
  choose_cancel: function () {
    this.setData({
      chooseE_hidden: true,
      chooseL_hidden: true,
      dataWindow_hidden: true,
      labWindow_hidden: true,
      eqpWindow_hidden: true,
      moreWindow_hidden: true,
      labMore_hidden: true,
      eqpMore_hidden: true,
      scanUpdateWindow_hidden: true,
      assemblyWindow_hidden: true,
    })
  },

  taptext: function (text) {
    this.setData({
      choose_hidden: false,
    });
  },

  chooseL: function () {
    this.setData({
      chooseL_hidden: false,
    });
  },
  chooseE: function () {
    this.setData({
      chooseE_hidden: false,
    });
  },

  labSerch: function (tap) {
    this.setData({
      chooseL_hidden: true,
      labName: tap.currentTarget.id,
    })
    console.log(tap.currentTarget.id)
    if (tap.currentTarget.id)
      var that = this
    that.setData({
      labMore_hidden: false
    })
    db.collection('Equipments').where({
      position: tap.currentTarget.id
    }).count({
      success(res) {
        console.log(res.total)
        var a = res.total
        var b = a / 20 + 1
        var all = []
        for (var i = 0; i <= b; i++) {
          db.collection('Equipments').where({
            position: tap.currentTarget.id
          }).skip(i * 20).get({
            success(res) {
              all = all.concat(res.data)
              console.log(all)
              var labData = []
              if (all.length == a) {
                for (var j = 0; j < a; j++) {
                  labData[j] = all[j].dq_num + '   ' + all[j].name + '   ' + all[j].duty
                }
              }
              console.log(labData)
              that.setData({
                lab: labData
              })
            }
          })
        }
      }
    })
  },

  use_register: function () {
    wx.switchTab({
      url: '../use_register/use_register'
    })
  },


  searchAgain: function (e) {
    console.log(e)
    var searchNum = e.currentTarget.id.split(' ')[0]
    var that = this
    db.collection('Equipments').where({
      dq_num: searchNum
    }).get({
      success(res) {
        console.log(res)
        that.setData({
          dataWindow_hidden: false,
          labWindow_hidden: true,
          eqpWindow_hidden: true,
          labMore_hidden: true,
          eqpMore_hidden: true,
          moreWindow_hidden: true,
          num: searchNum,
          data: res.data[0]
        })
      }
    })

  },
  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'name',
      success: function (name) {
        console.log(name)
        if (name.data.length == 0) {
          wx.redirectTo({
            url: '../yj/yj',
          })
        } else {
          that.setData({
            userName: name.data
          });
        }
      },
      fail: function (res) {
        wx.redirectTo({
          url: '../yj/yj',
        })
      }
    })
  },
  check_pic: function () {
    var that = this
    wx.cloud.downloadFile({
      fileID: 'cloud://eqp-14a8fd.6571-eqp-14a8fd-1257873478/equipment_pic/' + that.data.num + '.jpg',
      success: res => {
        wx.previewImage({
          current: res.tempFilePath, // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })
      },
      fail(res) {
        that.upload_pic("没有照片，要拍啦！")
      }
    })
  },
  upload_pic: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], //若要直接启动，这里把album删掉
      success(res) {
        wx.showLoading({
          title: '上传中',
        })
        console.log(res)
        wx.cloud.uploadFile({
          cloudPath: 'equipment_pic/' + that.data.num + '.jpg',
          filePath: res.tempFilePaths[0],
          success: res => {
            wx.hideLoading()
          },
          fail: res => {
            wx.hideLoading()
          },
        })
      }
    })
  },
  check_certificate: function () {
    var that = this
    wx.cloud.downloadFile({
      fileID: 'cloud://eqp-14a8fd.6571-eqp-14a8fd-1257873478/equipment_certificate/' + that.data.num + '.pdf',
      success: res => {
        console.log(res)
        wx.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res)
          },
          fail(res) {
            console.log(res)
          }
        });
      },
      fail(res) {
        wx.showToast({
          title: '无计量证书',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  onPullDownRefresh: function () {
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: function (res) {
        console.log(res)
        var str = [res.result[0], res.result.replace(res.result[0], '')]
        var searchNum = str[1]
        console.log(searchNum)
        if (str[0] == 's') {
          db.collection('Equipments').where({
            id: searchNum,
          }).get({
            success(res) {
              console.log(res)
              that.setData({
                scanUpdateWindow_hidden: false,
                scanResult: str[1],
                scanEqp: res.data[0].dq_num,
                scanID: res.data[0]._id
              })
            }
          })
        } else {
          wx.showToast({
            title: '扫描结果：' + res.result,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '温馨提示：',
          content: '扫码失败，有问题\n请呼叫Andy，谢谢！',
          showCancel: true,
          cancelColor: '#5b5b5b',
          cancelText: '再试一次',
          confirmText: '呼叫！',
          confirmColor: '#ff6369',
          success: function (res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: '13959177731'
              })
            }
          },
        })
      }
    })
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

});