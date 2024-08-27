import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct, getProducts } from "../../../public/functions/product";
import { Spinner } from "@nextui-org/react";
import { getSubCategories } from "../../../public/functions/subcategories";
import { Button as NextUIButton } from "@nextui-org/react";
import Carousel from "react-material-ui-carousel";
import { MdClose } from "react-icons/md";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [numLastResults, setNumLastResult] = useState(-1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [openImageSlider, setOpenImageSlider] = useState(false);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await getSubCategories();
        if (!res.error) {
          setSubCategories([
            { _id: "all", name: "All Categories" },
            ...res.data.data,
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };
    fetchSubCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [searchKeyword, sortOption, selectedSubCategories]);

  const fetchProducts = async (page, reset = false) => {
    setLoading(true);
    try {
      const q = {
        page: page,
        limit: 5,
        keyword: searchKeyword,
        sort: sortOption,
        subcategories: selectedSubCategories.join(","),
      };
      if (
        selectedSubCategories.length == 0 ||
        selectedSubCategories.includes("all")
      )
        delete q.subcategories;
      const query = new URLSearchParams(q).toString();

      const res = await getProducts(query);

      if (!res.error) {
        const newProducts = res.data.data;

        if (
          res.data.paginationResult.currentPage >=
          res.data.paginationResult.numberOfPages
        ) {
          setHasMore(false);
        }
        setNumLastResult(res.data.results);
        setProducts((prevProducts) =>
          reset ? newProducts : [...prevProducts, ...newProducts]
        );
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setLoading(false);
  };

  const handleEditProduct = (index) => {
    router.push(`/products/add-products?edit=${index}`);
  };

  const handleDeleteProduct = (index) => {
    setProductToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteProduct = async () => {
    setDeleting(true);
    try {
      await deleteProduct(productToDelete);
      const newProducts = products.filter(
        (product) => product._id !== productToDelete
      );
      setProducts(newProducts);
      setOpenDeleteDialog(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteProduct = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleSubCategoryChange = (event) => {
    const value = event.target.value;
    const filteredValue = value.filter((v) => v !== "all");
    const filteredSubCategories = subCategories
      .filter((category) => category._id !== "all")
      .map((category) => category._id);
    if (value.includes("all")) {
      setSelectedSubCategories(filteredSubCategories);
    } else {
      setSelectedSubCategories(filteredValue);
    }
  };

  const handleImageClick = (product) => {
    const images = [product.imageCover, ...product.images];
    setSelectedProductImages(images);
    setOpenImageSlider(true);
  };

  const closeImageSlider = () => {
    setOpenImageSlider(false);
    setSelectedProductImages([]);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ marginBottom: "20px" }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            placeholder="Search products"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") fetchProducts(1, true);
            }}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#fb923c",
                },
                "&:hover fieldset": {
                  borderColor: "#ea580c",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => fetchProducts(1, true)}
                    sx={{ color: "#fb923c" }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            variant="outlined"
            size="small"
            displayEmpty
            fullWidth
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#fb923c",
                },
                "&:hover fieldset": {
                  borderColor: "#ea580c",
                },
              },
            }}
          >
            <MenuItem value="">Sort by</MenuItem>
            <MenuItem value="price">Lower price</MenuItem>
            <MenuItem value="-price">Higher price</MenuItem>
            <MenuItem value="createdAt">Oldest</MenuItem>
            <MenuItem value="-createdAt">Newest</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Select
            multiple
            value={selectedSubCategories}
            onChange={handleSubCategoryChange}
            variant="outlined"
            size="small"
            displayEmpty
            fullWidth
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#fb923c",
                },
                "&:hover fieldset": {
                  borderColor: "#ea580c",
                },
              },
            }}
            renderValue={(selected) =>
              selected.length === 0 ||
              subCategories.filter((category) => category._id !== "all")
                .length == selected.length
                ? "All Categories"
                : selected
                    .map((id) => {
                      const category = subCategories.find(
                        (category) => category._id === id
                      );
                      return category ? category.name : "";
                    })
                    .join(", ")
            }
          >
            {subCategories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                <Checkbox
                  checked={selectedSubCategories.includes(category._id)}
                />
                <ListItemText primary={category.name} />
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Link href={"/products/add-products"} passHref legacyBehavior>
            <Button
              href="/products/add-products"
              variant="contained"
              startIcon={<AddCircleIcon className="text-white" />}
              sx={{
                width: "100%",
                height: "38px",
                border: "1px solid #fb923c",
                backgroundColor: "orange",
                color: "#fff",
                "&:hover": { backgroundColor: "#ea580c" },
                textTransform: "none",
                fontSize: "16px",
              }}
            >
              Add
            </Button>
          </Link>
        </Grid>
      </Grid>

      {products.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid #fb923c", backgroundColor: "#f1f5f9" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Description
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Size
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Categories
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Colors
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Images
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Edit Or Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.sizes.join(", ")}</TableCell>
                  <TableCell className="flex justify-center items-center">
                    {product.subcategories.map((subCategory) => (
                      <span key={subCategory._id}>{subCategory.name}</span>
                    ))}
                  </TableCell>
                  <TableCell>{product.colors.join(", ")}</TableCell>
                  <TableCell>
                    <Image
                      key={index}
                      src={product.imageCover}
                      alt={`Product Image ${index + 1}`}
                      style={{
                        objectFit: "cover",
                        borderRadius: "5px",
                        maxHeight: "60px",
                        minHeight: "60px",
                        cursor: "pointer",
                      }}
                      width={50}
                      height={50}
                      onClick={() => handleImageClick(product)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditProduct(index)}
                      sx={{ color: "#fb923c" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteProduct(product._id)}
                      sx={{ color: "#b91c1c" }}
                      className="text-red-700"
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

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Spinner color="primary" />
        </div>
      )}

      {hasMore && !loading && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        >
          {numLastResults == 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <p>No more products</p>
            </div>
          ) : (
            <Button
              onClick={() => fetchProducts(currentPage + 1)}
              variant="contained"
              sx={{
                backgroundColor: "#fb923c",
                "&:hover": { backgroundColor: "#ea580c" },
              }}
            >
              Load More
            </Button>
          )}
        </Box>
      )}

      <Dialog open={openDeleteDialog} onClose={cancelDeleteProduct}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <NextUIButton onClick={cancelDeleteProduct} color="none">
            Cancel
          </NextUIButton>
          <NextUIButton
            onClick={confirmDeleteProduct}
            color="primary"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </NextUIButton>
        </DialogActions>
      </Dialog>
      {/* Image Slider Dialog */}
      <Dialog
        PaperProps={{
          style: {
            outline: "3px solid #fb923c",
          },
        }}
        open={openImageSlider}
        onClose={closeImageSlider}
        aria-labelledby="image-slider-title"
        aria-describedby="image-slider-description"
        maxWidth="xs"
        fullWidth
      >
        <div style={{display : "flex", justifyContent : "center", alignItems : "center"}}>
        <DialogTitle
          id="image-slider-title"
          sx={{
            color: "orange",
            textAlign: "center",
            fontSize: "25px",
            fontWeight: "bold",
            padding: "5px 0px 5px 45px",
            flexGrow: 1,
          }}
        >
          {"Product Images"}
        </DialogTitle>
        <DialogActions>
          <NextUIButton onClick={closeImageSlider} color="primary" auto size="sm" isIconOnly startContent={<MdClose size={20}/>}>
          </NextUIButton>
        </DialogActions>
        </div>
        <DialogContent sx={{padding : "10px"}}>
          <Carousel
            navButtonsProps={{
              style: {
                color: "#ea580c",
                width: "40px",
                height: "40px",
                backgroundColor: "orange",
              },
            }}
            navButtonsAlwaysVisible
            autoPlay={false}
            fullHeightHover={false}
            activeIndicatorIconButtonProps={{
              style: {
                color: "orange",
              },
            }}
            navButtonsWrapperProps={{
              style: {
                top: "calc(50% - 20px)",
                height: "40px",
                marginInline: "-5px",
              },
            }}
          >
            {selectedProductImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Product Image ${index + 1}`}
                style={{
                  borderRadius: "5px",
                  width: "100%",
                  height: "350px",
                  objectFit: "contain",
                }}
                width={800}
                height={350}
              />
            ))}
          </Carousel>
        </DialogContent>

      </Dialog>
    </Box>
  );
}
