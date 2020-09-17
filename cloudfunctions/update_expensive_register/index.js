// 云函数入口函数
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  if (event.time.length != 0) { //用来判断是否不登记，只查用了的时间段
    for (var i = 0; i < event.time.length; i++) {
      var time = event.time[i]
      await db.collection('Use_Register').add({
        data: {
          date: event.date,
          time: time,
          register_time: event.register_time,
          mission_number: event.mission_number,
          equipment_number: event.equipment_number,
          name: event.name,
        }
      })
    }
  }

  if (event.equipment_number != null) {
    const countResult = await db.collection('Use_Register').where({
      equipment_number: event.equipment_number,
      date: event.date
    }).count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / 100)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('Use_Register').where({
        equipment_number: event.equipment_number,
        date: event.date
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    return (await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
      date: new Date().toLocaleDateString()
    }))
  }
}