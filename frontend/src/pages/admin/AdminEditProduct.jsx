import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleProductApi, updateProductApi } from '../../apis/Api';

const AdminEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [oldImage, setOldImage] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        getSingleProductApi(id).then((res) => {
            if (res.data.success) {
                const product = res.data.product;
                setProductName(product.productName);
                setProductPrice(product.productPrice);
                setProductDescription(product.productDescription);
                setProductCategory(product.productCategory);
                setOldImage(product.productImageUrl);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
            toast.error('Failed to fetch product details');
        });
    }, [id]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setProductImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('productPrice', productPrice);
        formData.append('productDescription', productDescription);
        formData.append('productCategory', productCategory);
        if (productImage) {
            formData.append('productImage', productImage);
        }
        formData.append('oldImage', oldImage); // Include old image URL if not updating
    
        updateProductApi(id, formData)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    navigate('/admin/dashboard');
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error('Internal Server Error!');
            });
    };
    return (
        <div className='m-3' style={{ overflowY: 'auto', maxHeight: '80vh' }}>
            <div className='d-flex gap-3'>
                <form onSubmit={handleSubmit}>
                    <label>Product Name</label>
                    <input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className='form-control mb-2'
                        type='text'
                        placeholder='Enter product name'
                        required
                    />

                    <label>Product Description</label>
                    <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className='form-control mb-2'
                        placeholder='Enter description'
                        cols='4'
                        rows='4'
                        required
                    ></textarea>

                    <label>Price</label>
                    <input
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        type='number'
                        className='form-control mb-2'
                        placeholder='Enter your price'
                        required
                    />

                    <label>Select category</label>
                    <select
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        className='form-control mb-2'
                        required
                    >
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                    </select>

                    <label>Product Image</label>
                    <input
                        onChange={handleImageUpload}
                        type='file'
                        className='form-control mb-2'
                    />

                    <button type='submit' className='btn btn-primary w-100 mt-2'>
                        Update Product
                    </button>
                </form>

                <div>
                    <h6>Old Image Preview</h6>
                    <img
                        className='img-fluid rounded-4 object-fit-cover'
                        width={300}
                        height={300}
                        src={oldImage}
                        alt='Old Product'
                    />

                    <h6 className='mt-4'>New Image Preview</h6>
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt='New Product'
                            className='img-fluid rounded-4 object-fit-cover'
                            width={300}
                            height={300}
                        />
                    ) : (
                        <p>No image selected!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminEditProduct;
