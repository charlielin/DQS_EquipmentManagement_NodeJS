const db = wx.cloud.database({
  env: 'eqp-14a8fd'
})
var date_choose = ''
var time_choose = ''
var name = ''
var title_color = '#7DE6C2'
var not_choose_color = '#A5DEE4'
var choose_color = '#F8A296'
Page({
  data: {
    equipment_info: {},
    equipment_list: [],
    mission_number: '',
    everyday_times: 0,

    prefixs: ['02501-20DQ', '(2020)MJDQ-', '(2020)FQIIDQ-', '(2020)FQIIDQE-'],
    numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '~', ',', '(', ')', '删除'],
    register_time: [],

    mission_edit_button: ['关闭窗口', '使用该时段'],

    equipment_choose_hidden: true,
    calendar_hidden: false,
    letters_hidden: false,
    register_time_hidden: true,
    mission_edit_hidden: true,

    value: '2020-11-11',
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    lastMonth: 'lastMonth',
    nextMonth: 'nextMonth',
  },
  mission_number_input(e) {
    this.setData({
      letters_hidden: false,
      register_time_hidden: true,
      mission_edit_hidden: true,
    })
  },
  time_choose_appear(e) {
    this.setData({
      letters_hidden: true,
      register_time_hidden: false,
    })
  },
  select(e) {
    var that = this
    var register_times = []
    if (e.detail == date_choose && that.data.register_time_hidden == false) {
      register_times = that.register_order(1) 
    } else {
      date_choose = e.detail
    }
    that.use_register(register_times) //不管是否有登记，都会触发这个函数，因为要刷新
  },
  use_register(time) { //time设计成数组，在本地进行逻辑分析需要等级多少个小时候，上传到服务器，直接循环登记即可，如果time为空，云函数仅进行查看
    var that = this
    if (time.length != 0 && (that.data.equipment_info.equipment_name == '' || that.data.mission_number == '')) {
      wx.showToast({
        title: '请选择设备并填写报告编号',
        duration: 1000,
        icon: 'none',
      })
    } else {
      wx.cloud.callFunction({
        name: 'update_expensive_register',
        data: {
          mission_number: that.data.mission_number,
          equipment_number: that.data.equipment_info.equipment_number,
          date: date_choose,
          time: time,
          register_time: new Date().toLocaleString(),
          name: name,
        },
        success: function (result) {
          that.register_time_reset()
          var times = []
          var time_data = result.result.data
          var register_time = that.data.register_time
          for (var i = 0; i < time_data.length; i++) {
            times[i] = time_data[i].time
          }
          for (var i = 0; i < register_time.length; i++) {
            var index = times.indexOf(register_time[i].time)
            if (index >= 0) {
              register_time[i].background_color = choose_color
            }
          }
          that.setData({
            register_time: register_time,
            mission_edit_hidden: true, //专门用于重复时段登记时，关闭窗口
          })
        },
        fail: function (result) {
          if (result.errCode != -404011)
            console.log(result)
          else
            that.register_time_reset()

        }
      })
    }
  },
  time_register(e) {
    var index = e.currentTarget.id
    var button = this.data.register_time[index]
    var background_color = button.background_color
    var time = []
    if (background_color == choose_color) {
      this.register_query(button.time)
    } else {
      if (background_color == title_color) {
        if (button.time == '全天')
          time = this.register_order(parseInt(24))
        else
          time = this.register_order(parseInt(button.time[0]))
      } else {
        time = [button.time]
      }
      this.use_register(time)
    }
  },
  mission_number_type(e) {
    var that = this
    var content = e.currentTarget.id
    var mission_number = that.data.mission_number
    if (content == '删除') {
      mission_number = mission_number.substring(0, mission_number.length - 1)
    } else {
      mission_number += content
    }
    that.setData({
      mission_number: mission_number
    })
  },
  delete_all(e) {
    var content = e.currentTarget.id
    if (content == '删除' || content == '重写') {
      this.setData({
        mission_number: ''
      })
    }
  },
  equipment_change(e) {
    this.setData({
      equipment_choose_hidden: false,
      calendar_hidden: true,
    })
  },
  equipment_choose(e) {
    var that = this
    var index = e.currentTarget.id
    var equipment_info = this.data.equipment_list[index]
    that.setData({
      equipment_info: equipment_info,
      equipment_choose_hidden: true,
      calendar_hidden: false,
    })
    this.use_register([]) //给空数组，只通过云函数查询使用情况。
  },
  toggleType() {
    this.selectComponent('#Calendar').toggleType();
  },
  register_time_reset() {
    var register_time = ['全天', '2h', '3h', '4h', '5h', '6h',
      '00时', '01时', '02时', '03时', '04时', '05时', '06时', '07时', '08时',
      '09时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时',
      '18时', '19时', '20时', '21时', '22时', '23时'
    ]
    for (var i = 0; i < 6; i++) {
      register_time[i] = {
        time: register_time[i],
        background_color: title_color
      }
    }
    for (var i = 6; i < register_time.length; i++) {
      register_time[i] = {
        time: register_time[i],
        background_color: not_choose_color
      }
    }
    this.setData({
      register_time: register_time
    })
  },
  register_order(time_quantity) {
    var register_time = this.data.register_time
    var time_order_jump = ['08时', '09时', '10时', '11时', '15时', '16时', '17时', '18时', '12时', '13时', '14时',
      '19时', '20时', '21时', '22时', '23时', '00时', '01时', '02时', '03时', '04时', '05时', '06时', '07时'
    ]
    var time_order_continuous = ['08时', '09时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时',
      '18时', '19时', '20时', '21时', '22时', '23时', '00时', '01时', '02时', '03时', '04时', '05时', '06时', '07时'
    ]
    var times = []
    if (time_quantity < 5) {
      for (var i = 0; i < register_time.length; i++) {
        if (register_time[i].background_color == choose_color) {
          time_order_jump.splice(time_order_jump.indexOf(register_time[i].time), 1)
        }
      }
      times = time_order_jump.slice(0, time_quantity)
    } else {
      var color = ''
      for (var i = 0; i < register_time.length; i++) { //为了将没有用过的时间整到前面去
        for (var j = 0; j < register_time.length; j++) {
          if (register_time[j].time == time_order_continuous[i]) {
            color = register_time[j].background_color
            break;
          }
        }
        if (color == not_choose_color) {
          time_order_continuous[i + 24] = time_order_continuous[i]
        } else {
          break;
        }
      }
      console.log(time_order_continuous)
      for (var i = 0; i < register_time.length; i++) {
        if (register_time[i].background_color == choose_color) {
          time_order_continuous.splice(0, time_order_continuous.indexOf(register_time[i].time) + 1)
        }
      }
      times = time_order_continuous.slice(0, time_quantity)
    }
    if (times.length < time_quantity) {
      wx.showToast({
        title: '没有足够长的时间',
        duration: 1000,
        icon: 'none',
      })
      times = [] //返回空就不会登记了，只会查询
    }
    return times
  },
  register_query(time) {
    var that = this
    time_choose = time
    wx.cloud.callFunction({
      name: 'query_expensive_by_hour',
      data: {
        equipment_number: that.data.equipment_info.equipment_number,
        date: date_choose,
        time: time
      },
      success: function (result) {
        var mission_infos = result.result.data
        that.setData({
          mission_infos: mission_infos,
          mission_edit_hidden: false,
        })
        if (mission_infos.length == 0) {
          that.setData({
            mission_edit_hidden: true,
          })
          that.use_register([])
        }
      },
      fail: function (result) {
        console.log(result)
      }
    })
  },
  mission_edit(e) {
    var that = this
    var index = e.currentTarget.id
    var mission_info = that.data.mission_infos[index]
    if (mission_info.name == name) {
      wx.cloud.callFunction({
        name: 'delete_expensive_register',
        data: {
          _id: mission_info._id
        },
        success: function (result) {
          console.log(result)
          that.register_query(time_choose)
        },
        fail: function (result) {
          console.log(result)
        }
      })
    } else {
      wx.showToast({
        title: '不可以删除别人的任务',
        duration: 1000,
        icon: 'none'
      })
    }
  },
  mission_edit_button(e) {
    var button = e.currentTarget.id
    if (button == '关闭窗口') {
      this.setData({
        mission_edit_hidden: true
      })
    } else {
      this.use_register([time_choose])
    }
  },
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'name',
      success: (result) => {
        name = result.data
      },
    })
    this.register_time_reset()
    wx.cloud.callFunction({
      name: 'query_expensive_equipment',
      data: {},
      success: function (result) {
        that.setData({
          equipment_list: result.result.data
        })
      },
      fail: function (result) {
        console.log(result)
      }
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})