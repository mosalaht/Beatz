
var express = require('express');

var router = express.Router();
var Handlebars=require('handlebars')
const userHelpers = require('../helpers/user-helper')
const productHelpers = require('../helpers/productHelpers')
const adminHelper = require('../helpers/adminhelper')
const categoryHelper=require('../helpers/categoryHelper')
const adminLoginVerify=(req,res,next)=>{
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin')

  }
}
/*admin route*/


router.get('/', function (req, res, next) {
    res.render('admin/admin-login');
  
  })


  router.post('/',(req,res)=>{
      res.render('admin/admin-dashboard')
   
    })


  router.get('/admin-viewproducts', function (req, res, next) {
    console.log('test2');
    productHelpers.getAllProducts().then((products)=>{
      res.render('admin/view-products',{products})
    })
    
  })

   router.post('/addproduct', (req, res) => {
    productHelpers.addProduct(req.body, (id) => {
      let image = req.files.Image
      console.log(id);
      image.mv('./public/product-images/' + id + '.jpg', (err) => {
        if (!err) {
          console.log("unda");
          res.redirect('/admin/admin-viewproducts')
        } else {
          console.log(err);
        }
      })
  
    })
  })
  
  router.get('/delete-product/:id',(req,res)=>{
let proId=req.params.id
console.log(proId);
productHelpers.deleteProduct(proId).then((response)=>{
  res.redirect('/admin/admin-viewproducts')
})
})


router.get('/view-users',(req,res)=>{
  userHelpers.getAllUsers().then((users)=>{
    
    res.render('admin/view-users',{users})
  })
 
})
router.get('/edit-product/:id',async (req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product} )
})
router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id);
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin/admin-viewproducts')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/admin-assets/product-images/'+id+'.jpg')
    }
  })
})

router.get('/block/:id',(req,res)=>{
  userHelpers.userblock(req.params.id).then(()=>{
    res.redirect('/admin/view-users')
})
})
router.get('/unblock/:id',(req,res)=>{
  userHelpers.userunblock(req.params.id).then(()=>{
    res.redirect('/admin/view-users')
})
})

router.get('/admin-vieworders',async(req,res)=>{
  console.log("123");
  let orders = await adminHelper.getallOrders()
  console.log(orders);
  res.render('admin/orders',{orders} )
})

/* GET ADMIN ADD  BANNER */
router.get('/add-banner',(req,res,next)=>{
  try {
    
      res.render('admin/add-banner',)
    
  } catch (error) {
   next(error)
  }
 });
  
 /* GET ADMIN VIEW BANNER */
 router.get('/banners',(req,res,next)=>{
  try {
   categoryHelper.getAllBanners().then((banners) => {
    console.log(banners);
      
      res.render('admin/banners',{banners} );
      
  })
  } catch (error) {
   next(error)
  }
 } );
 
  /*  POST ADMIN ADD BANNER */
  router.post('/add-banner',(req,res,next)=>{
   try {
     console.log(req.body);
     console.log(req.files.image);
    
     categoryHelper.addBanner(req.body,(id)=>{
      let image = req.files.image
      image.mv('./public/admin-asset/banner-images/'+id+'.jpg',(err,done)=>{
        if(!err){
          res.redirect('/admin/add-banner')
        } else{
          console.log(err);
        }
      })
    })
   } catch (error) {
     next(error)
   }
  
  } )
  
 /* GET ADMIN EDIT BANNER */
 router.get('/edit-banner/',async (req,res,next)=>{
   try {
     let bannerDetail=await categoryHelper.getBannerDetail(req.query.id)
     res.render('admin/edit-banner',)
   } catch (error) {
     next(error)
   }
 })
 
 /* POST ADMIN EDIT BANNER */
 router.post('/edit-banner/:id',(req,res,next)=>{
 try {
     let id=req.params.id
     console.log(req.params.id);
     categoryHelper.editBanner(req.params.id,req.body).then(()=>{
       res.redirect('/admin/')
       if(req.files.image){
       let image = req.files.image
       image.mv('./public/banner-image/'+id+'.jpg')
       }
     })
 } catch (error) {
   next(error)
 }
 })
 
 /* GET DELETE BANNER. */
 router.get('/delete-banner/',(req,res,next)=>{
   try {
     let banId=req.query.id
     categoryHelper.deleteBanner(banId).then((response)=>{
       res.redirect('/admin/banners')
     })
   } catch (error) {
     next(error)
   }
 })
// router.get('/admin-logout',(req,res)=>{
//   req.session.adminLoggedIn=false
//     req.session.admin=null
//   res.redirect('/admin')
// })

module.exports = router;
