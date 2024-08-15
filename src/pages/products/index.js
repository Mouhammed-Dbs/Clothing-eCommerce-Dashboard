import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  // Effect to load products from local storage
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);
  }, []);

  // Handle edit product action
  const handleEditProduct = (index) => {
    router.push(`/products/addProducts?edit=${index}`);
  };

  // Handle delete product action
  const handleDeleteProduct = (index) => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const newProducts = storedProducts.filter((_, i) => i !== index);
    localStorage.setItem('products', JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button
        href='/products/addProducts'
        variant="contained"
        startIcon={<AddCircleIcon className='text-white' />}
        className='hover:bg-[#A29415] text-slate-950 bg-[#E3D026] normal-case text-base'
        style={{ marginBottom: '20px' }}
      >
        Add Product
      </Button>
      {products.length > 0 && (
        <TableContainer component={Paper} className='border-2 border-orange-400 bg-slate-100'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-bold text-orange-700'>Name</TableCell>
                <TableCell className='font-bold text-orange-700'>Description</TableCell>
                <TableCell className='font-bold text-orange-700'>Price</TableCell>
                <TableCell className='font-bold text-orange-700'>Size</TableCell>
                <TableCell className='font-bold text-orange-700'>Categories</TableCell>
                <TableCell className='font-bold text-orange-700'>Images</TableCell>
                <TableCell className='font-bold text-orange-700'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{Array.isArray(product.selectedSize) ? product.selectedSize.join(', ') : ''}</TableCell>
                  <TableCell>{Array.isArray(product.selectedCategories) ? product.selectedCategories.join(', ') : ''}</TableCell>
                  <TableCell>{(product.images || []).map(image => image.name).join(', ')}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditProduct(index)}
                      className='text-orange-400'
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteProduct(index)}
                      className='text-red-700'
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}