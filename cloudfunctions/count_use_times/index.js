const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('Use_Register').where({ equipment_number: event.equipment_number, register_date: event.time_choose }).count()
  const total = countResult.total
  return total
}
