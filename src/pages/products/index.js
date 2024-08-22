import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  deleteProduct,
  getProducts,
  getSubCategories,
} from "../../../public/functions/product";
import { Spinner } from "@nextui-org/react"; // Import Spinner from NextUI

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
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        <Link href={"/products/add-products"} passHref legacyBehavior>
          <Button
            href="/products/add-products"
            variant="contained"
            startIcon={<AddCircleIcon className="text-white" />}
            sx={{
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
        <TextField
          placeholder="Search products"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") fetchProducts(1, true);
          }}
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
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

        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          variant="outlined"
          size="small"
          displayEmpty
          sx={{
            minWidth: "150px",
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

        <Select
          multiple
          value={selectedSubCategories}
          onChange={handleSubCategoryChange}
          variant="outlined"
          size="small"
          displayEmpty
          sx={{
            minWidth: "200px",
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
            subCategories.filter((category) => category._id !== "all").length ==
              selected.length
              ? "All Categories"
              : selected
                  .map((id) => {
                    const subCategory = subCategories.find(
                      (sub) => sub._id === id
                    );
                    return subCategory ? subCategory.name : "";
                  })
                  .join(", ")
          }
        >
          {subCategories.map((subCategory) => (
            <MenuItem key={subCategory._id} value={subCategory._id}>
              <Checkbox
                checked={
                  subCategory._id != "all"
                    ? selectedSubCategories.includes(subCategory._id)
                    : selectedSubCategories.length === 0 ||
                      subCategories.filter((category) => category._id !== "all")
                        .length == selectedSubCategories.length
                }
              />
              <ListItemText primary={subCategory.name} />
            </MenuItem>
          ))}
        </Select>
      </div>

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
                      }}
                      width={50}
                      height={50}
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

      {hasMore && !loading && numLastResults != 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            onClick={() => fetchProducts(currentPage + 1)}
            sx={{
              border: "1px solid #fb923c",
              backgroundColor: "orange",
              color: "#fff",
              "&:hover": { backgroundColor: "#ea580c" },
              textTransform: "none",
              fontSize: "16px",
            }}
          >
            Load More
          </Button>
        </div>
      )}
      {numLastResults == 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <p>No more products</p>
        </div>
      )}

      {/* Dialog for delete confirmation */}
      <Dialog
        open={openDeleteDialog}
        onClose={cancelDeleteProduct}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelDeleteProduct}
            color="primary"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteProduct}
            color="secondary"
            autoFocus
            disabled={deleting}
          >
            {deleting ? <Spinner size="sm" color="primary" /> : "Delete"}{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
