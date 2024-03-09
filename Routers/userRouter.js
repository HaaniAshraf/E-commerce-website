const express=require('express')
const router=express.Router()


const {
    userhomeGet,
    menSectionGet,
    womenSectionGet,
    jewelrySectionGet,
    perfumeSectionGet,
    electronicSectionGet,
    userlistGet,
    blockUser,
    unblockUser,
    removeUser,
    userDetailsGet
}=require('../Controller/userController')


router.get('/',userhomeGet)
      .get('/menSection',menSectionGet)
      .get('/womenSection',womenSectionGet)
      .get('/jewelrySection',jewelrySectionGet)
      .get('/perfumeSection',perfumeSectionGet)
      .get('/electronicSection',electronicSectionGet)
      .get('/userlist',userlistGet)
      .get('/userDetails/:userId',userDetailsGet)
      .post('/blockUser/:userId',blockUser)
      .post('/unblockUser/:userId',unblockUser)
      .post('/removeUser/:userId',removeUser) 

module.exports=router