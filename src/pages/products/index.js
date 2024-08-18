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
import Image from 'next/image';

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  // Effect to load products from local storage
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    console.log('Retrieved products:', storedProducts); // Debug log
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
        sx={{border:"1px solid #fb923c" ,backgroundColor:"orange" , color:"#fff" ,"&:hover":{backgroundColor:"#ea580c"} , textTransform:"none" ,fontSize:"16px"}}
        style={{ marginBottom: '20px' }}
      >
        Add Product
      </Button>
      {products.length > 0 && (
        <TableContainer component={Paper} sx={{border:"1px solid #fb923c", backgroundColor:"#f1f5f9"}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{fontWeight:"bold", color:"#c2410c"}}>Name</TableCell>
                <TableCell sx={{fontWeight:"bold", color:"#c2410c"}}>Description</TableCell>
                <TableCell sx={{fontWeight:"bold", color:"#c2410c"}}>Price</TableCell>
                <TableCell sx={{fontWeight:"bold", color:"#c2410c"}}>Size</TableCell>
                <TableCell sx={{fontWeight:"bold", color:"#c2410c"}}>Categories</TableCell>
                <TableCell sx={{fontWeight:"bold", color:"#c2410c"}}>Colors</TableCell>
                <TableCell sx={{fontWeight:"bold", color:"#c2410c"}}>Images</TableCell>
                <TableCell sx={{fontWeight:"bold", color:"#c2410c"}}>Edit Or Delete</TableCell>
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
                  <TableCell>{Array.isArray(product.selectedColors) ? product.selectedColors.join(', ') : ''}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {product.images.map((image, idx) => (
                        <Image
                          key={idx}
                          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                          alt={`Product Image ${idx + 1}`}
                          style={{  objectFit: 'cover', borderRadius: '5px' }}
                          width={50}
                          height={50}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditProduct(index)}
                      sx={{color:"#fb923c"}}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteProduct(index)}
                      sx={{color:"#b91c1c"}}
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