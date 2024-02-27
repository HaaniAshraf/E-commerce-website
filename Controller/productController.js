const mongoose=require('mongoose')
const { ObjectId } = require('mongoose').Types;
const { User,Profile,Address,Product,Banner,Coupon,Wishlist,Cart,Review } = require('../Model/db');

module.exports={

    productlistGet:async(req,res)=>{
        try {
          const products = await Product.find();
              res.render('productlist', { products });
        } catch (error) {
          console.error('Error fetching products:', error);
          res.status(500).send('Internal Server Error');
        }
      },


    productDetailsGet:async(req,res)=>{
        const dynamicTitle = 'Product Details';
        const productId = req.params.productId;

      try {
          const product = await Product.findById(productId);
          if (!product) {
              return res.status(404).json({ success: false, error: 'Product not found' });
          }

          const productReview = await Review.findOne({ product:productId }).populate('reviews.user');
          res.render('productDetails', { product,title:dynamicTitle,productReview });

      } catch (error) {
          console.error('Error fetching product details:', error.message);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      },


      addProductGet:async(req,res)=>{
        res.render('addProduct')
      },
  
  
      addProductPost: async (req, res) => {
        const { name, category, description, rating, price, ogPrice } = req.body;
        const images = req.files.map(file => '/images/uploads/' + file.filename);
    
        try {
            const validCategories = ['home', 'mens', 'womens','jewelry','perfume','electronics'];
            if (!validCategories.includes(category)) {
                return res.status(400).send('Invalid category');
            }
              const newProduct = new Product({
                imageUrls: images,
                name,
                category,
                description,
                rating,
                price,
                ogPrice,
            });
              await newProduct.save();
              res.redirect('/productlist');
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    
   
      updateProductGet:async(req,res)=>{
        const productId = req.params.productId;
    try {
      const product = await Product.findById(productId);   
      if (!product) {
        return res.status(404).send('Product not found');
      }
      res.render('updateProduct', { product });
    } catch (error) {
      console.error('Error fetching product for update:', error);
      res.status(500).send('Internal Server Error');
    }
      },
  
  
      updateProductPost: async (req, res) => {
        const productId = req.params.productId;
        const { name, category, description, rating, price, ogPrice } = req.body;
        try {
          const product = await Product.findById(productId);
          if (!product) {
              return res.status(404).json({ success: false, error: 'Product not found' });
          }
          let images;
          if (req.files && req.files.length > 0) {
              images = req.files.map(file => '/images/uploads/' + file.filename);
          } else {
              images = product.imageUrls[0] || [];
          }
          const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: { imageUrls: images, name, category, description, rating, price, ogPrice } },
            { new: true }
          );   
          if (!updatedProduct) {
            return res.status(404).json({ success: false, error: 'Product not found' });
          }    
          res.redirect('/productlist');
        } catch (error) {
          console.error('Error updating product:', error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      },
      
   
      deleteProduct:async(req,res)=>{
        try {
          const productId = req.params.productId;
         await Product.deleteOne({ _id: productId });     
          res.redirect('/productlist')
        } catch (error) {
             console.error('Error deleting product:', error);
        }
        },
  
}