const postModel = require('../model/post');
const userModel = require('../model/user'); 
const cloudinary = require('../config/cloudinary')
const fs = require('fs')


exports.createPost = async (req, res) => {
    try {
        const { userId } = req.params;
        const { content } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: 'User trying to create Post, does not exists.'
            })
        }

        const data = {
            content,
            userId
        }


        const newPost = new postModel(data);

        user.posts.push(newPost._id);
    
        await newPost.save();
        await user.save();

        res.status(201).json({
            message: 'Post created successfully',
            data: newPost
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getOnePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id).populate('userId');

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }
        res.status(200).json({
            message: `Post found`,
            data: post
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}