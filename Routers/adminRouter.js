const express=require('express')
const router=express.Router()

const {
    adminhomeGet,
    monthlySales,
    popularProduct,
    mostOrderedProduct,
    mostActiveUser,
    userSignups,
    productDataGet,
    recentUpdates,
}=require('../Controller/adminController')


router.get('/adminHome',adminhomeGet)
      .get('/sales',monthlySales)
      .get('/popularProduct',popularProduct)
      .get('/mostOrderedProduct',mostOrderedProduct)
      .get('/mostActiveUser',mostActiveUser)
      .get('/userSignups',userSignups)
      .get('/productData',productDataGet)
      .get('/recentUpdates',recentUpdates) 

module.exports=router