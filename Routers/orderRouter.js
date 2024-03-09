const express=require('express')
const router=express.Router()


const {
    checkoutGet,
    checkoutPost,
    razorPayPost,
    orderPost,
    orderPlacedGet,
    ordersGet,
    cancelOrderPost,
    reviewGet,
    reviewPost,
    orderListGet,
    orderDetailsGet,
    orderStatusPost,
    reviewListGet,
}=require('../Controller/orderController')


router.get('/checkout',checkoutGet)
      .post('/checkout',checkoutPost)
      .post('/createRazorpayOrder',razorPayPost)
      .post('/createOrder',orderPost)
      .get('/orderPlaced',orderPlacedGet)
      .get('/orders',ordersGet)
      .post('/cancelOrder/:orderId',cancelOrderPost)
      .get('/review',reviewGet)
      .post('/review',reviewPost)
      .get('/orderList',orderListGet)
      .get('/orderDetails/:orderId',orderDetailsGet)
      .post('/updateOrderStatus/:orderId',orderStatusPost)
      .get('/reviewList',reviewListGet)


module.exports=router