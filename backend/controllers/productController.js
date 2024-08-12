const cloudinary = require('cloudinary').v2;
const Products = require('../model/productModel');

const createProduct = async (req, res) => {
    try {
        // Destructure data
        const {
            productName,
            productPrice,
            productDescription,
            productCategory,
        } = req.body;

        // Check if files are attached
        const productImage = req.files.productImage;

        // Validate data
        if (!productName || !productPrice || !productDescription || !productCategory || !productImage) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(productImage.path, {
            folder: 'products',
            crop: 'scale',
        });

        const newProduct = new Products({
            productName,
            productPrice,
            productDescription,
            productCategory,
            productImageUrl: result.secure_url,
        });

        await newProduct.save();
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};



const getProducts = async (req, res) => {
    try {
        const allProducts = await Products.find({});
        res.json({
            success: true,
            message: 'All products fetched successfully!',
            products: allProducts,
        });
    } catch (error) {
        console.log(error);
        res.send('Internal server error');
    }
};

const getSingleProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const singleProduct = await Products.findById(productId);
        res.json({
            success: true,
            message: 'Single product fetched successfully!',
            product: singleProduct,
        });
    } catch (error) {
        console.log(error);
        res.send('Internal server error');
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, productPrice, productDescription, productCategory } = req.body;
        let productImageUrl = req.body.oldImage;

        // Check if all required fields are present
        if (!productName || !productPrice || !productDescription || !productCategory) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        // Handle image upload if a new image is provided
        if (req.files && req.files.productImage) {
            const result = await cloudinary.uploader.upload(req.files.productImage.path, {
                folder: 'products',
                crop: 'scale',
            });
            productImageUrl = result.secure_url;
        }

        // Update product
        const updatedProduct = await Products.findByIdAndUpdate(id, {
            productName,
            productPrice,
            productDescription,
            productCategory,
            productImageUrl,
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error updating product:', error); // Log error details
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
// Delete product
const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        await Products.findByIdAndDelete(productId);
        res.json({
            success: true,
            message: 'Product deleted successfully!',
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Server error!!',
        });
    }
};

// Search products
const searchProducts = async (req, res) => {
    const { query } = req.query;

    try {
        const searchResults = await Products.find({
            $or: [
                { productName: { $regex: new RegExp(query, 'i') } },
                { productDescription: { $regex: new RegExp(query, 'i') } },
            ],
        });

        res.json({
            success: true,
            message: 'Search results fetched successfully!',
            results: searchResults,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
};
