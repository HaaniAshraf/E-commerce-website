const express=require('express')
const router=express.Router()
const upload = require('../Middleware/multermiddleware')

const{
    productlistGet,
    productDetailsGet,
    addProductGet,
    addProductPost,
    updateProductGet,
    updateProductPost,
    deleteProduct,

}=require('../Controller/productController')

router.get('/productlist',productlistGet)
      .get('/addProduct',addProductGet)
      .post('/addProduct',upload.array('productimg', 5),addProductPost)
      .get('/updateProduct/:productId',updateProductGet)
      .post('/updateProduct/:productId',upload.array('productimg', 5),updateProductPost)
      .post('/deleteproduct/:productId',deleteProduct)
      .get('/details/:productId',productDetailsGet)


module.exports=router