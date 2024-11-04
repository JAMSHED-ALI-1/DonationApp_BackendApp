const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel.js');

// @desc    Add Category
// @route   POST /api/categories/add
// @access  Private
const addCategory = asyncHandler(async (req, res) => {
    // Ensure the request body is parsed and category_name exists
    const { category_name } = req.body;

    // Check if category_name is undefined or an empty string
    if (!category_name || typeof category_name !== 'string') {
        return res.status(400).json({
            success: false,
            msg: 'Category name is required and must be a string.'
        });
    }

    // Trim the category name
    const trimmedCategoryName = category_name.trim();

    // Check for existing category (case-insensitive)
    const existingCategory = await Category.findOne({
        category_name: { $regex: new RegExp(`^${trimmedCategoryName}$`, 'i') }
    });

    if (existingCategory) {
        return res.status(400).json({
            success: false,
            msg: 'Category already added.'
        });
    }

    // Create the new category
    const newCategory = await Category.create({ category_name: trimmedCategoryName });

    return res.status(201).json({
        success: true,
        msg: 'Category created',
        data: newCategory
    });
});

// @desc    Delete Category
// @route   DELETE /api/categories/:catId
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.catId;

    // Find and delete the category
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    // Check if category was found and deleted
    if (!deletedCategory) {
        return res.status(404).json({
            success: false,
            msg: 'Category not found.'
        });
    }

    // Return success response
    res.status(200).json({
        success: true,
        msg: 'Successfully deleted',
        data: deletedCategory
    });
});

// @desc    Get All Categories
// @route   GET /api/categories
// @access  Private
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json({
        success: true,
        data: categories
    });
});

// @desc    Edit Category
// @route   PUT /api/categories/:catId
// @access  Private
const editCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.catId;

    // Find the category
    let category = await Category.findById(categoryId);

    if (!category) {
        return res.status(404).json({
            success: false,
            msg: 'Category not found.'
        });
    }

    // Update the category
    category = await Category.findByIdAndUpdate(categoryId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: category, msg: 'Successfully updated' });
});

module.exports = {
    addCategory,
    deleteCategory,
    getAllCategories,
    editCategory,
};
