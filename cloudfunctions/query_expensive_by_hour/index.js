const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
    const missions = db.collection('Use_Register').where({equipment_number: event.equipment_number, date: event.date, time: event.time}).get()
    return missions
}