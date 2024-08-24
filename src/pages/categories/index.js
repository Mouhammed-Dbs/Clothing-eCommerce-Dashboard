import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Input } from "@nextui-org/input";
import { Button as NextUIButton } from "@nextui-org/button";
import { getSubCategoriesWithProductCount } from "../../../public/functions/subcategories";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {MdFormatListBulleted ,MdDelete } from "react-icons/md"

export default function Categories() {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchSubCategorieswithProductCount = async () => {
      setLoading(true);
      try {
        const res = await getSubCategoriesWithProductCount();
        console.log("res", res);
        if (!res.error) {
          setSubCategories([
            ...res.data.data,
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch subcategories with product count:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategorieswithProductCount();
  }, []);

  const handleAddNewCategories = () => {
    setVisible(true);
  };

  const closeHandler = () => {
    setVisible(false);
  };

  const handleDeleteCategory = (index) => {
    setCategoryToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteCategory = async () => {
    setDeleting(true);
    try {
      await deleteCategory(categoryToDelete);
      const newCategories = subCategories.filter(
        (category) => category._id !== categoryToDelete
      );
      setSubCategories(newCategories);
      setOpenDeleteDialog(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Failed to delete category:", err);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteCategory = () => {
    setOpenDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const handleMenuClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const router = useRouter();
  const handleOpenProductBySubCategory = () => {
    router.push("/products");
  };

  return (
    <div className="p-5 min-[600px]:mr-[10%] min-[600px]:ml-[10%]"  >
      <div className="mb-5">
        <Button
          onClick={handleAddNewCategories}
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
          New Category
        </Button>
      </div>
      {subCategories.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid #fb923c", backgroundColor: "#f1f5f9" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell  sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Category Name
                </TableCell>
                <TableCell  sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Products
                </TableCell>
                <TableCell  align="right" sx={{ fontWeight: "bold", color: "#c2410c" }}>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell padding="none" sx={{paddingLeft:"35px"}}>{category.productCount}</TableCell>
                  <TableCell  padding="none" sx={{paddingright:"35px"}}>
                    <IconButton
                      onClick={(event) => handleMenuClick(event, category)}
                      sx={{ color: "#b91c1c" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleDeleteCategory(category._id)}>
                        <MdDelete className="text-red-500 mr-2 text-3xl"/> Delete
                      </MenuItem>
                      <MenuItem onClick={handleOpenProductBySubCategory}>
                        <MdFormatListBulleted className="text-orange-500 mr-2 text-3xl" /> Go to Products
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg min-[600px]:ml-[30%] min-[1200px]:ml-[20%]">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <Input
              variant="bordered"
              size="lg"
              color="primary"
              classNames={{
                input: "text-red-500 font-semibold text-black",
                base: "bg-transparent rounded-xl",
                inputWrapper: "bg-white",
                innerWrapper: "bg-transparent",
              }}
              type="text"
              name="newCategorie"
              placeholder="Enter new category"
              radius="sm"
            />
            <div className="mt-4 flex gap-4">
              <NextUIButton color="primary" auto>
                Add
              </NextUIButton>
              <NextUIButton onClick={closeHandler} color="error" auto>
                Cancel
              </NextUIButton>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "25%",
          }}
        >
          <Spinner color="primary" />
        </div>
      )}
      <Dialog
        open={openDeleteDialog}
        onClose={cancelDeleteCategory}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <NextUIButton
            onClick={cancelDeleteCategory}
            color="none"
            disabled={deleting}
          >
            Cancel
          </NextUIButton>
          <NextUIButton
            onClick={confirmDeleteCategory}
            color="primary"
            autoFocus
            disabled={deleting}
          >
            {deleting ? <Spinner size="sm" color="primary" /> : "Delete"}{" "}
          </NextUIButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}