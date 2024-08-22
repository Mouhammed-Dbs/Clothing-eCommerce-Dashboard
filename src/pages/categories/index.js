import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Input } from "@nextui-org/input";
import { Button as NextUIButton } from "@nextui-org/button";

export default function Categories() {
    const [categories, setCategories] = useState([
        { name: "Category 1", productCount: 10 },
        { name: "Category 2", productCount: 20 },
        { name: "Category 3", productCount: 30 },
    ]);
    const [visible, setVisible] = useState(false);

    const handleAddNewCategories = () => {
        setVisible(true);
    };

    const closeHandler = () => {
        setVisible(false);
    };

    const handleDeleteCategory = (index) => {
        setCategories(categories.filter((_, i) => i !== index));
    };

    return (
        <div style={{ padding: "20px" }}>
            <div className="mb-5">
                <Button
                    onClick={() => handleAddNewCategories("categories")}
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

            <TableContainer
                component={Paper}
                sx={{ border: "1px solid #fb923c", backgroundColor: "#f1f5f9" }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                                Category Name
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                               Products
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                                Delete
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category, index) => (
                            <TableRow key={index}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.productCount}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleDeleteCategory(index)}
                                        sx={{ color: "#b91c1c" }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {visible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg min-[600px]:ml-[30%] min-[1200px]:ml-[20%]">
                        <h2 className="text-xl font-bold mb-4">
                            Add New Category
                        </h2>
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
        </div>
    );
}