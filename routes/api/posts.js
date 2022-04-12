const express = require('express');
const router = express.Router();
const { check, validationResult } = require
('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const { findOneAndRemove } = require('../../models/User');
const { reset } = require('nodemon');


// @route   POST -> api/posts
// @desc    Create Posts
// @access  Private

router.post(
  '/',
[ auth,
  check('text','Text is required').notEmpty()
],
async (req,res) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    return res.status(400).json({ errors: error.array()})
  }

  try {
    const user = await User.findById(req.user.id).select('-password');

   const createPost = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };
    const newPost = await new Post(createPost);
    await newPost.save();
    res.json(newPost)
  } catch (err) {
    return res.status(500).json({ msg:err.message})
  }
});


// @route   POST -> api/posts
// @desc    Get all Posts
// @access  Private

router.get('/', auth, async (req,res)=>{
  try {
    const posts = await Post.find().sort({ date:-1 })
    res.json(posts)
  } catch (err) {
    return res.status(500).json({ msg:err.message})
  }
})

// @route   POST -> api/posts
// @desc    Get Post by Id
// @access  Private

router.get('/:id',auth, async(req,res)=>{
  try {
    const posts = await Post.find({ user:req.params.id })
    if(!posts){
      return res.status(404).json({ msg:"No post for this User found" })
    }
    res.json(post)
  } catch (err) {
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg:"No post found" })
    }
    return res.status(500).json({ msg:err.message})
  }
})


// @route   DELETE -> api/posts
// @desc    Delete Posts by post id
// @access  Private

router.delete('/:id',auth, async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id)

    if(!post){
      return res.status(404).json({ msg:"No post for this User found" })
    }
    // check if the user deleting the post owns it
    // Posts.user is an object id and not a string
    if(post.user.toString() !== req.user.id){
      return res.status(401).json({ msg:"User not authorized" })
    } 
    await post.remove();
    return res.json({ msg:"Post removed" })
  } catch (err) {
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg:"No post found" })
    }
    return res.status(500).json({ msg:err.message})
  }
})


// @route   PUT -> api/posts/likes/:id
// @desc    Like a post
// @access  Private

router.put('/likes/:id',auth, async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if the user has already liked the post

    if(post.likes.filter(like => like.user.toString() === req.user.id).length>0){
      return res.status(400).json({ msg:"Post already liked"})
    }

    post.likes.unshift({ user:req.user.id })

    await post.save()

    res.json(post.likes);
  } catch (err) {
    console.error(err.message)
  }
})


// @route   PUT -> api/posts/unlikes/:id
// @desc    NLike a post
// @access  Private

router.put('/unlikes/:id',auth, async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if the user has already liked the post

    if(post.likes.filter(like => like.user.toString() === req.user.id).length===0){
      return res.status(400).json({ msg:"Post has not been liked yet"})
    }

    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

    post.likes.splice(removeIndex,1)

    await post.save()

    res.json({ msg:"Post Unliked" });
  } catch (err) {
    console.error(err.message)
  }
})


// @route   POST -> api/posts/comments/:id
// @desc    Comment on Posts
// @access  Private

router.post(
  '/comments/:id',
[ auth,
  check('text','Text is required').notEmpty()
],
async (req,res) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    return res.status(400).json({ errors: error.array()})
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id)
   const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };
    post.comments.unshift(newComment)
    await post.save();
    res.json(post.comments)
  } catch (err) {
    return res.status(500).json({ msg:err.message})
  }
});




// @route   DELETE -> api/posts/comments/:id/:comment_id
// @desc    Delete Comment
// @access  Private

router.delete('/comments/:id/:comment_id',auth, async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id)

    const comment = post.comments.find(item => item.id === req.params.comment_id)

    if(!comment){
      return res.status(404).json({ msg:"Comment not Found"})
    }

    // check if user deleting the comment is the owner of that comment

    console.log(comment)
    if(comment.user.toString() !== req.user.id){
      return res.status(404).json({ msg:"Not Authorized"})
    }

    
    const removeIndex = post.comments.map(item => item.id.toString()).indexOf(req.params.comment_id)

    post.comments.splice(removeIndex,1)

    await post.save()
    
    return res.json({ msg:"Comment Removed" })
  } catch (err) {
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg:"No post found" })
    }
    return res.status(500).json({ msg:err.message})
  }
})

module.exports = router;