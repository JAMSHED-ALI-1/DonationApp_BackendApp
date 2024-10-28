const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken.js')
const User = require('../models/userModel.js')

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Please provide both email and password.'
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
        favorites: user.favorites
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      msg: 'Server error during login'
    });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Please provide all required fields.'
    });
  }

  try {
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        msg: 'Email already registered'
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      success: true,
      msg: 'Account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        // token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      msg: 'Server error during registration'
    });
  }
});



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      favorites: user.favorites,
      otp: user.otp
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


const resetPassword = asyncHandler(async(req,res) => {

  // console.log(verifyOtp(req.body.token));
  console.log(req.body.token)
  res.json({
    // token: verifyOtp(req.body.token)
  })
  // const user = await User.findById(req.user._id)
  // const {oldPassword = ''} = req.body;
  // // For old password
  // if (user && (await user.matchPassword(oldPassword))) {
  //   let randomOtp = Math.floor(100000 + Math.random() * 900000);
  //   user.otp = randomOtp;
  //   await user.save();

  //   mailer.send({
  //     to: user.email,
  //     subject: 'Reset your password. ReactNews',
  //     html: `Your otp for reset password is ${randomOtp}`
  //   });

  //   res.status(200).json({
  //     success: true,
  //     msg: 'A Otp has been sent to your registered email address.'
  //   })
  // } else {
  //   res.status(404).json({
  //     success: false,
  //     msg: 'Entered Old Password is Incorrect.'
  //   })
  // }
});

const addToFav = asyncHandler(async(req, res) => {
    const newsId = req.params.newsId;
    const userId = req.user._id;

    // let obj = arr.find(o => o.name === 'string 1');
    // check if exist news in fav array or not

    let user = await User.findById(userId);
    console.log("user", user)

    let foundNews = user.favorites.find( obj => {
      console.log(obj)
      return obj.news == newsId
    });

    console.log("foundNews", foundNews)
    if(foundNews) {


    let newUserData = user.favorites.filter((obj) => {
      return obj.news != newsId
    })


    user.favorites = newUserData;

      await user.save()

      return res.status(201).json({
        success: true,
        msg: 'Removed from your favorite lists.'
      })
    }

   let user1 =  user.favorites.push({news: newsId});
    await user.save();
    console.log(user1)

     res.status(201).json({
      success: true,
      msg: 'Added to your favorite lists.'
    })

})



const getFavorites = asyncHandler(async(req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId)
    .populate({path: 'favorites.news',
    populate: ('category')
})


  console.log(req)
  res.json({
    success: true,
    data: user.favorites,
    msg: 'Successfully fetched'
  })
})


const checkFavExistsOrNot = asyncHandler(async(req, res) => {
  const userId = req.user._id;
  const newsId = req.params.newsId

  let user = await User.findById(userId);
  console.log("user", user)

  let foundNews = user.favorites.find( obj => {
    console.log(obj)
    return obj.news == newsId
  });

  console.log("foundNews", foundNews)
  if(!foundNews) {
    return res.json({
      success: true,
      exists: false,
      msg: 'News id not exists in your favorite list.'
    })
  }
  res.json({
    success: true,
    exists: true,
    msg: 'News id exists in your favorite list.'
  })

})



const removeFavorite = asyncHandler(async(req, res) => {
  const userId = req.user._id;
  const newsId = req.params.newsId

  let user = await User.findById(userId);
  console.log("user", user)

  let foundNews = user.favorites.find( obj => {
    console.log(obj)
    return obj.news == newsId
  });

  console.log("foundNews", foundNews)
  if(!foundNews) {
    return res.json({
      success: false,
      msg: 'News id not exists in your favorite list.'
    })
  }


  let newUserData = user.favorites.filter((obj) => {
    return obj.news != newsId
  })


  user.favorites = newUserData;

  await user.save()


  res.json({
    success: true,
    data: newUserData,
    msg: 'Successfully removed'
  })

})


module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  resetPassword,
  addToFav,
  getFavorites,
  removeFavorite,
  checkFavExistsOrNot
}