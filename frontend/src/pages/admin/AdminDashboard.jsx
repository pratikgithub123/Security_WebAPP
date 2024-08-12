import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProductApi, deleteProductApi, getAllProductsApi } from '../../apis/Api';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('Indoor');
    const [productImage, setProductImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getAllProductsApi().then((res) => {
            setProducts(res.data.products);
        });
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setProductImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!productName || !productPrice || !productDescription || !productCategory || !productImage) {
            toast.error('Please fill all the fields');
            return;
        }

        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('productPrice', productPrice);
        formData.append('productDescription', productDescription);
        formData.append('productCategory', productCategory);
        formData.append('productImage', productImage);

        createProductApi(formData).then((res) => {
            if (res.data.success === false) {
                toast.error(res.data.message);
            } else {
                toast.success(res.data.message);
                navigate('/admin/dashboard');
            }
        }).catch((err) => {
            console.log(err);
            toast.error('Internal Server Error!');
        });
    };

    const handleDelete = (id) => {
        const confirm = window.confirm("Are you sure you want to delete this product?");
        if (!confirm) {
            return;
        } else {
            deleteProductApi(id).then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                    window.location.reload();
                }
            }).catch((err) => {
                console.log(err);
                toast.error('Internal Server Error!');
            });
        }
    };

    return (
        <div className='m-4'>
            <div className='d-flex justify-content-between'>
                <h1>Product Details</h1>
                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Add Product
                </button>
                <Link to="/admin/dashboarduser" className="userdetails">
                    User Details <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
                </Link>
                <Link to="/admin/dashboardusercart" className="userdetails">
                    Cart Details <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
                </Link>
            </div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Create a new product!</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <label>Product Name</label>
                            <input onChange={(e) => setProductName(e.target.value)} className='form-control mb-2' type="text" placeholder='Enter product name' />

                            <label htmlFor="">Product Description</label>
                            <textarea onChange={(e) => setProductDescription(e.target.value)} className='form-control mb-2' placeholder="Enter description" cols="4" rows="4"></textarea>

                            <label htmlFor="">Price</label>
                            <input onChange={(e) => setProductPrice(e.target.value)} type="number" className='form-control mb-2' placeholder='Enter your price' />

                            <label htmlFor="">Select category</label>
                            <select onChange={(e) => setProductCategory(e.target.value)} className='form-control mb-2'>
                                <option value="Indoor">Indoor</option>
                                <option value="Outdoor">Outdoor</option>
                            </select>

                            <label>Product Image</label>
                            <input onChange={handleImageUpload} type="file" className='form-control' />

                            {previewImage && <img src={previewImage} className='img-fluid rounded object-cover mt-2' alt="preview" />}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={handleSubmit} type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <table className='table mt-2'>
                <thead className='table-dark'>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Name</th>
                        <th>Product Price</th>
                        <th>Product Category</th>
                        <th>Product Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item) => (
                        <tr key={item._id}>
                            <td><img src={item.productImageUrl} height={40} width={40} alt="product" /></td>
                            <td>{item.productName}</td>
                            <td>Rs.{item.productPrice}</td>
                            <td>{item.productCategory}</td>
                            <td>{item.productDescription.slice(0, 10)}....</td>
                            <td>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <Link to={`/admin/edit/${item._id}`} type="button" className="btn btn-success">Edit</Link>
                                    <button onClick={() => handleDelete(item._id)} type="button" className="btn btn-danger">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
