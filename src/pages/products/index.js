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
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getProducts } from "../../../public/functions/product";
import { Spinner } from "@nextui-org/react";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [searchKeyword, sortOption]);

  const fetchProducts = async (page, reset = false) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page,
        limit: 5,
        keyword: searchKeyword,
        sort: sortOption,
      }).toString();

      const res = await getProducts(query);

      if (!res.error) {
        const newProducts = res.data.data;

        if (
          res.data.paginationResult.currentPage >=
          res.data.paginationResult.numberOfPages
        ) {
          setHasMore(false);
        }

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
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Link href={"/products/add-products"} passHref legacyBehavior>
        <Button
          href="/products/add-products"
          variant="contained"
          startIcon={<AddCircleIcon className="text-white" />}
          sx={{
            border: "1px solid #fb923c",
            backgroundColor: "orange",
            color: "#fff",
            "&:hover": { backgroundColor: "#ea580c" },
            textTransform: "none",
            fontSize: "16px",
          }}
          style={{ marginBottom: "20px" }}
        >
          Add Product
        </Button>
      </Link>

      {/* Search and Sort Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        {/* Search Field */}
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

        {/* Sort Dropdown */}
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
                  <TableCell>{product.size.join(", ")}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
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
                  {/* <TableCell>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                    >
                      {product.images.map((image, idx) => (
                        <Image
                          key={idx}
                          src={image}
                          alt={`Product Image ${idx + 1}`}
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                          width={50}
                          height={50}
                        />
                      ))}
                    </div>
                  </TableCell> */}
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditProduct(index)}
                      sx={{ color: "#fb923c" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteProduct(index)}
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
    </div>
  );
}
