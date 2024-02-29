const mongoose=require('mongoose')
const { ObjectId } = require('mongoose').Types;
const { User,Profile,Address,Product,Banner,Coupon,Wishlist,Cart,Order,Review } = require('../Model/db');

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




        searchGet: async (req, res) => {
          try {
            const searchTerm = req.query.searchWord;
            const userId = req.session.user ? req.session.user.userId : null;
            
            if (searchTerm) {
              const regex = new RegExp(escapeRegex(searchTerm), 'gi');
              const foundProducts = await Product.find({ name: regex });
              
              function escapeRegex(text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
              }
        
              const userWishlist = await Wishlist.findOne({ user:userId })
              const userCart = await Cart.findOne({ user:userId })
    
              res.render('searchPage', { products: foundProducts, searchTerm, userWishlist, userCart });
            } else {
              res.render('searchPage', { products: [], searchTerm: '' });
            }
          } catch (error) {
            console.error('Error during search get:', error);
            res.status(500).send('Internal Server Error');
          }

        },




        filterProductsGet:async(req,res)=>{
          try {
            const { minPrice ,maxPrice, price, rating, category, sort } = req.query;

            const banners = await Banner.find();
            let userWishlist = null;
            let wishlistCount = 0;
            let userCart = null;
            let cartCount=0

            if (req.session.email) {
              try {
                  const userId = req.session.user.userId;
                  userWishlist = await Wishlist.findOne({ user: userId });
                  if (userWishlist) {
                      wishlistCount = userWishlist.products.length;
                  }
                  userCart = await Cart.findOne({ user: userId });
                  if (userCart) {
                    cartCount = userCart.products.length;
                }
  
              } catch (error) {
                  res.status(500).send('Internal Server Error');
                  return;
              }
          }
        
            const filterQuery = {};
        
            if (price === 'Between 10k and 50k') {
              filterQuery.price = { $gte: 10000, $lte: 50000 };
            }  
              else if (price === 'Above 50k') {
              filterQuery.price = { $gt: 50000 };
            } 
               else if (minPrice && maxPrice) { 

              const parsedMinPrice = parseInt(minPrice);
              const parsedMaxPrice = parseInt(maxPrice);

                if(minPrice !== '2500' || maxPrice !== '7500'){
                  if (!isNaN(parsedMinPrice) && !isNaN(parsedMaxPrice)) {
                    filterQuery.price = { $gte: parsedMinPrice, $lte: parsedMaxPrice };
                } else {
                    console.error('Invalid price range input');
                }
                }            
          }
        
            if (rating) {
              if (rating === '5') {
                filterQuery.rating = 5;
              } 
              else if (rating === 'above 3') {
                filterQuery.rating = { $gt: 3 };
              } 
              else if (rating === 'below 3') {
                filterQuery.rating = { $lt: 3 }; 
              } 
              else {
                console.error('Invalid rating value');
              }
            }
        
            if (category) {
              filterQuery.category = category; 
            }

            const sortOption = {};
            if (sort === 'AscendingPrice') {
                sortOption.price = 1; 
            } else if 
             (sort === 'DescendingPrice') {
                sortOption.price = -1; 
            }else if 
              (sort === 'AscendingRating') {
              sortOption.rating = 1; 
            }else if 
              (sort === 'DescendingRating') {
              sortOption.rating = -1; 
            }
        
            const filteredProduct = await Product.find(filterQuery).sort(sortOption);

            res.render('userHome', { banners, products: filteredProduct, userWishlist, wishlistCount,userCart,cartCount });

          } catch (error) {
            console.error('Error during filter get:', error);
            res.status(500).send('Internal Server Error');
          }
        },
        
  
}