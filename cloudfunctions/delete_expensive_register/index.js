// 云函数入口函数
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('Use_Register').doc(event._id).remove()
  } catch (e) {
    console.error(e)
  }
}