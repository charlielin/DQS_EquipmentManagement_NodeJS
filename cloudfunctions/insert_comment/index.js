// 云函数入口函数
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    console.log(event)
    return await db.collection('HowTo').doc(event._id).update({
      // data 传入需要局部更新的数据
      data: {
        comment: event.comment,
      }
    })
  } catch (e) {
    console.error(e)
  }
}