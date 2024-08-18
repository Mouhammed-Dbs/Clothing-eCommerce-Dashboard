import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Tooltip, Input, Button, Spacer } from '@nextui-org/react';
import Select from 'react-select';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const customStyles = {
  control: (provided) => ({ ...provided, borderColor: 'orange', boxShadow: 'none', cursor: 'pointer', padding: '4px', backgroundColor: 'white', '&:hover': { borderColor: 'orange' } }),
  option: (provided, state) => ({ ...provided, backgroundColor: state.isSelected ? 'orange' : 'white', color: state.isSelected ? 'white' : 'black', '&:hover': { backgroundColor: '#fb923c', cursor: 'pointer', color: 'white', fontWeight: 'bold' } }),
  multiValue: (provided, state) => {
    if (state.selectProps.name === 'selectedColors') {
      const selectedColor = state.data.value;
      return {
        ...provided,
        backgroundColor: selectedColor,
        color: 'white',
        borderRadius: '12px',
        fontWeight: 'semibold'
      };
    }
    return {
      ...provided,
      backgroundColor: 'orange',
      color: 'white',
      borderRadius: '12px',
      fontWeight: 'bold'
    };
  },
  multiValueLabel: (provided) => ({ ...provided, color: 'white' }),
  multiValueRemove: (provided) => ({ ...provided, color: 'white', '&:hover': { backgroundColor: 'orange' } }),
};

export default function AddProducts() {
  const [product, setProduct] = useState({
    colors: ["Red", "Blue", "Green", "Yellow"],
    categories: ["Shoes", "Clothing", "Accessories", "Jeans"],
    name: '', description: '', price: '', size: ["S", "M", "L", "XL", "XXL"],
    images: [], selectedColors: [], selectedCategories: [], selectedSize: []
  });
  const [isClient, setIsClient] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [optionType, setOptionType] = useState('');

  useEffect(() => {
    setIsClient(true);
    const { edit } = router.query;
    if (edit !== undefined) {
      const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
      setProduct(storedProducts[edit]);
      setEditIndex(edit);
    }
  }, [router.query]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct({ ...product, [name]: name === 'images' ? Array.from(files) : value });
  };

  const handleSelectChange = (name, selectedOptions) => {
    setProduct({ ...product, [name]: selectedOptions ? selectedOptions.map(option => option.value) : [] });
  };

  const handleAddNewOptions = (OptionType) => {
    setOptionType(OptionType);
    setVisible(true);
  };

  const closeHandler = () => {
    setVisible(false);
    setNewOption('');
  };

  const addNewOption = () => {
    if (newOption) {
      setProduct({ ...product, [optionType]: [...product[optionType], newOption] });
      closeHandler();
    }
  };

  const handleAddOrUpdateProduct = () => {
    if (!product.name || !product.description || !product.price || !product.size) {
      alert('Please fill in all fields');
      return;
    }
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const productToStore = { ...product, images: product.images.map(file => (typeof file === 'string' ? file : file.name)) };

    if (editIndex !== null) {
      storedProducts[editIndex] = productToStore;
    } else {
      storedProducts.push(productToStore);
    }

    try {
      localStorage.setItem('products', JSON.stringify(storedProducts));
      router.push('/products');
      setProduct({ name: '', description: '', price: '', size: '', images: [], selectedCategories: [], selectedSize: [], selectedColors: [] });
      setEditIndex(null);
    } catch (error) {
      console.error('Error serializing products:', error);
    }
  };

  if (!isClient) return null;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 p-6">
        <div className="max-w-xl mx-auto p-5 font-sans bg-slate-100 shadow-2xl rounded-lg">
          <h1 className="text-4xl font-extrabold text-center text-orange-500 mb-2">
            {editIndex !== null ? 'Edit Product' : 'Add Product'}
          </h1>
          <form className="flex flex-col gap-2 mb-6">
            <div>
              <label className="text-lg font-semibold text-orange-500 mb-2 inline-block">Categories</label>
              <div className='flex flex-row gap-5 items-center'>
                <Select 
                  isMulti
                  name="selectedCategories"
                  placeholder="Select categories"
                  value={product.selectedCategories.map(category => ({ value: category, label: category }))}
                  onChange={(selectedOptions) => handleSelectChange('selectedCategories', selectedOptions)}
                  options={(product.categories || []).map(category => ({ value: category, label: category }))}
                  styles={customStyles}
                  className='w-full'
                />
                <Tooltip content='Click to add new category ' color='primary'>
                  <Button onClick={() => handleAddNewOptions('categories')} color="primary" auto isIconOnly>
                    <AddCircleIcon />
                  </Button>
                </Tooltip>
              </div>
            </div>
            <label className="text-lg font-semibold text-orange-500  inline-block">Name</label>
            <Input variant='bordered' size='lg' color='primary' classNames={{ input:"text-red-500 font-semibold text-black", base: 'bg-transparent rounded-xl', inputWrapper: 'bg-white', innerWrapper:"bg-transparent"}} type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} radius="sm"/>
            <label className="text-lg font-semibold text-orange-400  inline-block">Price</label>
            <Input variant='bordered' size='lg' color='primary' classNames={{ input:"text-red-500 font-semibold text-black", base: 'bg-transparent rounded-xl', inputWrapper: 'bg-white', innerWrapper:"bg-transparent"}} type="number" name="price" placeholder="Product Price" value={product.price} onChange={handleChange} radius="sm" startContent={<div className="pointer-events-none flex items-center"><span className="text-orange-4000 text-lg">$</span></div>}/>
            <label className="text-lg font-semibold text-orange-500 inline-block">Sizes</label>
            <div className='flex flex-row gap-5 items-center'>
              <Select
                isMulti
                name="selectedSize"
                placeholder="Select sizes"
                value={product.selectedSize.map(size => ({ value: size, label: size }))}
                onChange={(selectedOptions) => handleSelectChange('selectedSize', selectedOptions)}
                options={(product.size || []).map(size => ({ value: size, label: size }))}
                styles={customStyles}
                className='w-full'
              />
              <Tooltip content='Click to add new size ' color='primary'>
                <Button onClick={() => handleAddNewOptions('size')} color="primary" auto isIconOnly>
                  <AddCircleIcon />
                </Button>
              </Tooltip>
            </div>
            <label className="text-lg font-semibold text-orange-500 inline-block">Colors</label>
            <div className='flex flex-row gap-5 items-center'>
              <Select
                isMulti
                name="selectedColors"
                placeholder="Select colors"
                value={product.selectedColors.map(color => ({ value: color, label: color }))}
                onChange={(selectedOptions) => handleSelectChange('selectedColors', selectedOptions)}
                options={(product.colors || []).map(color => ({ value: color, label: color }))}
                styles={customStyles}
                className='w-full'
              />
              <Tooltip content='Click to add new color ' color='primary'>
                <Button onClick={() => handleAddNewOptions('colors')} color="primary" auto isIconOnly>
                  <AddCircleIcon />
                </Button>
              </Tooltip>
            </div>
            <label className="text-lg font-semibold text-orange-500 block">Description</label>
            <Input variant='bordered' size='lg' color='primary' classNames={{ input:"font-semibold text-black", base: 'bg-transparent rounded-xl', inputWrapper: 'bg-white', innerWrapper:"bg-transparent"}} type="text" name="description" placeholder="Product Description" value={product.description} onChange={handleChange} radius="sm" />
            <label className="text-lg font-semibold text-orange-500 block">Upload Product Images</label>
            <input type="file" name="images" multiple onChange={handleChange} className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition duration-200 ease-in-out" />
            <Spacer y={1} />
            <Button onClick={handleAddOrUpdateProduct} color="primary" auto size='lg' className='font-extrabold'>
              {editIndex !== null ? 'Update Product' : 'Add Product'}
            </Button>
          </form>
        </div>
      </div>
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold text-orange-500 mb-4">Add New {optionType}</h3>
            <input
              type="text"
              className="w-full p-2 border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-300 rounded mb-4"
              placeholder={`Enter new ${optionType}`}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border-orange-400 border-2 hover:bg-orange-300 hover:text-white transition duration-200 ease-in-out rounded" onClick={closeHandler}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-400 hover:bg-orange-500 transition duration-200 ease-in-out text-white rounded" onClick={addNewOption}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}