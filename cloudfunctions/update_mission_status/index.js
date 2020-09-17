// 云函数入口函数
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('Map').doc(event._id).update({
      data: {
        status: event.status,
        [event.update_user_type]: event.user,
        iconPath: event.iconPath,
        notice:event.notice
      }
    })
  } catch (e) {
    console.error(e)
  }
}