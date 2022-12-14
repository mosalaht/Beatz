var db=require('../config/connection')
var collection=require('../config/collections')
var userHelper=require('../helpers/user-helper')
var ObjectId=require('mongodb').ObjectId
                                               
module.exports={
applyCoupon: (coupon, userId) => {
    console.log(coupon);
    return new Promise(async (resolve, reject) => {
        let response = {};
        response.discount = 0;
        let couponData = await db.get().collection(collection.COUPON_COLLECTION).findOne({ code: coupon.code })
        if (couponData) {
            let userExit = await db.get().collection(collection.COUPON_COLLECTION).findOne({code: coupon.code ,user: { $in: [ObjectId(userId)] } })
            console.log("userEXIT:"+userExit);
            if (userExit) {
                response.status = false;
                resolve(response)
            } else {
                response.status = true;
                response.coupon = couponData;
                

                userHelper.getTotalAmount(userId).then((total) => {
                    response.discountTotal = total - ((total * couponData.discount) / 100)
                    response.discountPrice = (total * couponData.discount) / 100
                    console.log("res",response);
                    resolve(response)
                })
            }
        } else {
            response.status = false;
            resolve(response)
        }
    })
}
}

