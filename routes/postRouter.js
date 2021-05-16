const express=require('express');
const postController=require('../controllers/postController');
var router=express.Router();
const protect=require('../middleware/authmiddleware');

//localhost:3000/posts/
router.route("/")
.get(protect,postController.getAllPosts)
.post(protect,postController.createPost);

router.route("/:id")
.get(protect,postController.getOnePost)
.patch(protect,postController.updatePost)
.delete(protect,postController.deletePost);

module.exports=router;