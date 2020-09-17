//身份认证复制几个步骤：1、复制该云函数；2、复制yj.js文件并修改最开始的云环境ID；3、新建数据库Users，并修改权限为第一个。
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('Users').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        user_name: event.user_name,
        openID : event.openID,
      }
    })
  } catch (e) {
    console.error(e)
  }
}