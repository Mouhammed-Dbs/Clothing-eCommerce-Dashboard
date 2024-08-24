import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Tooltip, Input, Button, Spacer } from "@nextui-org/react";
import Select from "react-select";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { addProducts } from "../../../public/functions/product";
import { getSubCategories } from "../../../public/functions/subcategories";

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "orange",
    boxShadow: "none",
    cursor: "pointer",
    padding: "4px",
    backgroundColor: "white",
    "&:hover": { borderColor: "orange" },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "orange" : "white",
    color: state.isSelected ? "white" : "black",
    "&:hover": {
      backgroundColor: "#fb923c",
      cursor: "pointer",
      color: "white",
      fontWeight: "bold",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "orange",
    color: "white",
    borderRadius: "12px",
    fontWeight: "bold",
  }),
  multiValueLabel: (provided) => ({ ...provided, color: "white" }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "white",
    "&:hover": { backgroundColor: "orange" },
  }),
};

export default function AddProductsPage() {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    imageCover: null,
    images: [],
    category: "66ba082cbc9bbcd6bc0f16c1",
    subcategories: [],
    selectedSizes: [],
    selectedColors: [],
    sizes: ["Small", "Medium", "Large", "XL", "XXL"],
    colors: ["White", "Black", "Red", "Blue", "Green", "Yellow"],
  });

  const [subCategories, setSubCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [optionType, setOptionType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSubCategories = async () => {
      const response = await getSubCategories();
      if (!response.error) {
        setSubCategories(response.data.data);
      } else {
        console.error("Failed to fetch subcategories:", response.data);
      }
    };

    fetchSubCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setProduct({
      ...product,
      [name]:
        name === "imageCover"
          ? Array.from(files)[0]
          : name === "images"
          ? Array.from(files)
          : value,
    });
  };

  const handleSelectChange = (name, selectedOptions) => {
    setProduct({
      ...product,
      [name]: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    });
  };

  const handleAddProduct = async () => {
    setErrorMessage("");
    const {
      title,
      description,
      price,
      quantity,
      selectedColors,
      selectedSizes,
      subcategories,
      imageCover,
    } = product;

    if (
      !title ||
      !description ||
      !price ||
      !quantity ||
      !imageCover ||
      selectedColors.length === 0 ||
      selectedSizes.length === 0 ||
      subcategories.length === 0
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setLoading(true); // تعيين حالة التحميل إلى true
    try {
      await addProducts({
        ...product,
        selectedColors: product.selectedColors,
        selectedSizes: product.selectedSizes,
      });
      router.push("/products");
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage(
        error?.message || "Failed to add the product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewOptions = (OptionType) => {
    setOptionType(OptionType);
    setVisible(true);
  };

  const closeHandler = () => {
    setVisible(false);
    setNewOption("");
  };

  const addNewOption = () => {
    if (newOption) {
      setProduct({
        ...product,
        [optionType]: [...product[optionType], newOption],
      });
      closeHandler();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 p-6">
        <div className="max-w-xl mx-auto p-5 font-sans bg-slate-100 shadow-2xl rounded-lg">
          <h1 className="text-4xl font-extrabold text-center text-orange-500 mb-2">
            Add Product
          </h1>
          <form className="flex flex-col gap-2 mb-6">
            {/* Categories Input */}
            <div>
              <label className="text-lg font-semibold text-orange-500 mb-2 inline-block">
                Subcategories *
              </label>
              <div className="flex flex-row gap-5 items-center">
                <Select
                  isMulti
                  name="subcategories"
                  placeholder="Select subcategories"
                  value={product.subcategories.map((id) => {
                    const subCategory = subCategories.find(
                      (sub) => sub._id === id
                    );
                    return subCategory
                      ? { value: subCategory._id, label: subCategory.name }
                      : null;
                  })}
                  onChange={(selectedOptions) =>
                    handleSelectChange("subcategories", selectedOptions)
                  }
                  options={subCategories.map((sub) => ({
                    value: sub._id,
                    label: sub.name,
                  }))}
                  styles={customStyles}
                  className="w-full"
                />
              </div>
            </div>

            {/* Name Input */}
            <label className="text-lg font-semibold text-orange-500 inline-block">
              Name *
            </label>
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
              name="title"
              placeholder="Product Name"
              value={product.title}
              onChange={handleChange}
              radius="sm"
            />

            {/* Price Input */}
            <label className="text-lg font-semibold text-orange-400 inline-block">
              Price *
            </label>
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
              type="number"
              name="price"
              placeholder="Product Price"
              value={product.price}
              onChange={handleChange}
              radius="sm"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-orange-4000 text-lg">$</span>
                </div>
              }
            />

            {/* Quantity Input */}
            <label className="text-lg font-semibold text-orange-500 inline-block">
              Quantity *
            </label>
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
              type="number"
              name="quantity"
              placeholder="Product Quantity"
              value={product.quantity}
              onChange={handleChange}
              radius="sm"
            />

            {/* Sizes Input */}
            <label className="text-lg font-semibold text-orange-500 inline-block">
              Sizes *
            </label>
            <div className="flex flex-row gap-5 items-center">
              <Select
                isMulti
                name="selectedSizes"
                placeholder="Select sizes"
                value={product.selectedSizes.map((size) => ({
                  value: size,
                  label: size,
                }))}
                onChange={(selectedOptions) =>
                  handleSelectChange("selectedSizes", selectedOptions)
                }
                options={product.sizes.map((size) => ({
                  value: size,
                  label: size,
                }))}
                styles={customStyles}
                className="w-full"
              />
              <Tooltip content="Click to add new size" color="primary">
                <Button
                  onClick={() => handleAddNewOptions("sizes")}
                  color="primary"
                  auto
                  isIconOnly
                >
                  <AddCircleIcon />
                </Button>
              </Tooltip>
            </div>

            {/* Colors Input */}
            <label className="text-lg font-semibold text-orange-500 inline-block">
              Colors *
            </label>
            <div className="flex flex-row gap-5 items-center">
              <Select
                isMulti
                name="selectedColors"
                placeholder="Select colors"
                value={product.selectedColors.map((color) => ({
                  value: color,
                  label: color,
                }))}
                onChange={(selectedOptions) =>
                  handleSelectChange("selectedColors", selectedOptions)
                }
                options={product.colors.map((color) => ({
                  value: color,
                  label: color,
                }))}
                styles={customStyles}
                className="w-full"
              />
              <Tooltip content="Click to add new color" color="primary">
                <Button
                  onClick={() => handleAddNewOptions("colors")}
                  color="primary"
                  auto
                  isIconOnly
                >
                  <AddCircleIcon />
                </Button>
              </Tooltip>
            </div>

            {/* Description Input */}
            <label className="text-lg font-semibold text-orange-500 inline-block">
              Description *
            </label>
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
              name="description"
              placeholder="Product Description"
              value={product.description}
              onChange={handleChange}
              radius="sm"
            />

            {/* Cover Image Input */}
            <label className="text-lg font-semibold text-orange-500 inline-block">
              Cover Image *
            </label>
            <Input
              variant="bordered"
              size="lg"
              color="primary"
              type="file"
              name="imageCover"
              onChange={handleChange}
              radius="sm"
            />

            {/* Additional Images Input */}
            <label className="text-lg font-semibold text-orange-500 inline-block">
              Additional Images
            </label>
            <Input
              variant="bordered"
              size="lg"
              color="primary"
              type="file"
              name="images"
              multiple
              onChange={handleChange}
              radius="sm"
            />
            {errorMessage && (
              <div className="text-red-500 text-center mb-4">
                {errorMessage}
              </div>
            )}
            <Button
              onClick={handleAddProduct}
              color="primary"
              auto
              disabled={loading} // تعطيل الزر أثناء التحميل
            >
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </div>
      </div>

      {/* Add New Option Modal */}
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Add New {optionType === "sizes" ? "Size" : "Color"}
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
              name="newOption"
              placeholder={`Enter new ${
                optionType === "sizes" ? "size" : "color"
              }`}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              radius="sm"
            />
            <div className="mt-4 flex gap-4">
              <Button onClick={addNewOption} color="primary" auto>
                Add
              </Button>
              <Button onClick={closeHandler} color="error" auto>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
