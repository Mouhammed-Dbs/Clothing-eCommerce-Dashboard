import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Form input component
const FormInput = ({ type, name, placeholder, value, onChange }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 ease-in-out"
  />
);

// Form select component
const FormSelect = ({ name, value, onChange, options = [] }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    multiple
    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 ease-in-out"
  >
    {options.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default function AddProducts() {
  const [product, setProduct] = useState({
    categories: ["Shoes", "Clothing", "Accessories", "Jeans"],
    name: '',
    description: '',
    price: '',
    size: ["S", "M", "L", "XL", "XXL"],
    images: [],
    selectedCategories: [],
    selectedSize: []
  });
  const [isClient, setIsClient] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const router = useRouter();

  // Effect to handle client-side rendering and edit mode
  useEffect(() => {
    setIsClient(true);
    const { edit } = router.query;
    if (edit !== undefined) {
      const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
      const productToEdit = storedProducts[edit];
      setProduct(productToEdit);
      setEditIndex(edit);
    }
  }, [router.query]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files, options } = e.target;
    if (name === 'images') {
      setProduct({ ...product, [name]: Array.from(files) });
    } else if (name === 'selectedCategories' || name === 'selectedSize') {
      const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
      setProduct({ ...product, [name]: selectedOptions });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  // Handle adding or updating a product
  const handleAddOrUpdateProduct = () => {
    if (!product.name || !product.description || !product.price || !product.size) {
      alert('Please fill in all fields');
      return;
    }
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (editIndex !== null) {
      storedProducts[editIndex] = product;
    } else {
      storedProducts.push(product);
    }
    localStorage.setItem('products', JSON.stringify(storedProducts));
    router.push('/products');
    setProduct({ name: '', description: '', price: '', size: '', images: [], selectedCategories: [], selectedSize: [] });
    setEditIndex(null);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto max-md:max-w-md max-sm:max-w-[26rem] p-5 font-sans bg-slate-100 shadow-2xl rounded-lg">
      <h1 className="text-3xl font-bold text-center text-orange-400 mb-6">
        {editIndex !== null ? 'Edit Product' : 'Add Product'}
      </h1>
      <form className="flex flex-col gap-4 mb-6">
        <FormInput
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
        />
        <FormInput
          type="text"
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
        />
        <FormInput
          type="number"
          name="price"
          placeholder="Product Price"
          value={product.price}
          onChange={handleChange}
        />
        {Array.isArray(product.size) && (
          <FormSelect
            name="selectedSize"
            value={product.selectedSize}
            onChange={handleChange}
            options={product.size}
          />
        )}
        {Array.isArray(product.categories) && (
          <FormSelect
            name="selectedCategories"
            value={product.selectedCategories}
            onChange={handleChange}
            options={product.categories}
          />
        )}
        <input
          type="file"
          name="images"
          multiple
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition duration-200 ease-in-out"
        />
        <button
          type="button"
          onClick={handleAddOrUpdateProduct}
          className="font-medium p-3 bg-orange-400 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out"
        >
          {editIndex !== null ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}