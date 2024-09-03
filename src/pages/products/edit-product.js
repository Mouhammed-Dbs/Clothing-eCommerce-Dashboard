import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProduct, updateProduct } from "../../../public/functions/product";
import { getSubCategories } from "../../../public/functions/subcategories";
import Image from "next/image";
import {
  Tooltip,
  Input,
  Button,
  Modal,
} from "@nextui-org/react";
import Select from "react-select";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { MdClose } from "react-icons/md";
import { Spinner } from "@nextui-org/react";

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

const EditProduct = () => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [optionType, setOptionType] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    subCategory: [],
    sizes: [],
    colors: [],
    images: [],
    coverImage: "",
    color: [],
    size: [],
  });

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

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await getProduct(id);
          if (!res.error) {
            const productData = { ...res.data.data };
            setProduct(productData);
            setFormData({
              title: productData.title || "",
              description: productData.description || "",
              price: productData.price || "",
              subCategory: productData.subCategories
                ? productData.subCategories.map((sub) => sub._id)
                : [],
              color: productData.colors || [],
              size: productData.sizes || [],
              quantity: productData.quantity || "",
              images: productData.images || [],
              coverImage: productData.imageCover || "",
              colors: ["white", "black", "red", "blue", "green", "yellow"],
              sizes: ["small", "medium", "large", "xl", "xxl"],
            });
          }
        } catch (error) {
          console.error("Failed to fetch product:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, selectedOptions) => {
    setFormData({
      ...formData,
      [name]: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProduct(id, formData);
      if (!res.error) {
        router.push("/products");
      } else {
        console.error("Failed to update product:", res);
      }
    } catch (error) {
      console.error("Failed to update product:", error);
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
      setFormData({
        ...formData,
        [optionType]: [...formData[optionType], newOption],
      });
      closeHandler();
    }
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: name === "coverImage" ? newImages[0].url : [...prev[name], ...newImages],
    }));
  };

  const handleImageDelete = (index) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      newImages.forEach((image) => URL.revokeObjectURL(image.url));
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const handleCoverImageDelete = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: "",
    }));
  };

  if (loading) return <div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "30%",
  }}
>
  <Spinner color="primary" />
</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 p-6">
      <div className="max-w-2xl mx-auto p-5 font-sans bg-slate-100 shadow-2xl rounded-lg">
        <h1 className="text-4xl font-extrabold text-center text-orange-500 mb-2">
          Edit Product
        </h1>
        <form className="flex flex-col gap-2 mb-6" onSubmit={handleSubmit}>
          <label className="text-lg font-semibold text-orange-500 inline-block">
            Subcategories *
          </label>
          <Select
            isMulti
            name="subCategory"
            placeholder="Select subcategory"
            value={formData.subCategory?.map((subCategoryId) => {
              const subCategory = subCategories.find(
                (sub) => sub._id === subCategoryId
              );
              return { value: subCategoryId, label: subCategory?.name || subCategoryId };
            })}
            onChange={(selectedOptions) =>
              handleSelectChange("subCategory", selectedOptions)
            }
            options={subCategories.map((sub) => ({
              value: sub._id,
              label: sub.name,
            }))}
            styles={customStyles}
            className="w-full"
          />
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
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            radius="sm"
          />

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
            value={formData.description}
            onChange={handleChange}
            radius="sm"
          />

          <label className="text-lg font-semibold text-orange-500 inline-block">
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
            value={formData.price}
            onChange={handleChange}
            radius="sm"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-orange-4000 text-lg">$</span>
              </div>
            }
          />

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
            value={formData.quantity}
            onChange={handleChange}
            radius="sm"
          />

          <label className="text-lg font-semibold text-orange-500 inline-block">
            Color *
          </label>
          <div className="flex flex-row gap-5 items-center">
            <Select
              isMulti
              name="color"
              placeholder="Select color"
              value={formData.color?.map((color, index) => ({
                key: index,
                value: color,
                label: color,
              }))}
              onChange={(selectedOptions) =>
                handleSelectChange("color", selectedOptions)
              }
              options={formData.colors?.map((col, index) => ({
                key: index,
                value: col,
                label: col,
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
          <label className="text-lg font-semibold text-orange-500 inline-block">
            Size *
          </label>
          <div className="flex flex-row gap-5 items-center">
            <Select
              isMulti
              name="size"
              placeholder="Select size"
              value={formData.size?.map((size, index) => ({
                key: index,
                value: size,
                label: size,
              }))}
              onChange={(selectedOptions) =>
                handleSelectChange("size", selectedOptions)
              }
              options={formData.sizes.map((sz, index) => ({
                key: index,
                value: sz,
                label: sz,
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

          <label className="text-lg font-semibold text-orange-500 inline-block">
            Cover Image *
          </label>
          {formData.coverImage && (
            <div className="w-fit relative mb-2">
              <Image
                src={formData.coverImage}
                alt="Cover"
                width={100}
                height={100}
                className="w-24 h-24 object-cover"
              />
              <Button
                size="sm"
                color="error"
                onClick={handleCoverImageDelete}
                isIconOnly
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <MdClose size={20} />
              </Button>
            </div>
          )}
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
            type="file"
            name="coverImage"
            onChange={handleImageChange}
            radius="sm"
          />

          <label className="text-lg font-semibold text-orange-500 inline-block">
            Product Images *
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  width={100}
                  height={100}
                  src={image}
                  alt={`Product ${index}`}
                  className="w-24 h-24 object-cover"
                />
                <Button
                  size="sm"
                  color="error"
                  onClick={() => handleImageDelete(index)}
                  isIconOnly
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <MdClose size={20} />
                </Button>
              </div>
            ))}
          </div>
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
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            radius="sm"
          />

          <Button type="submit" color="primary" auto>
            Update Product
          </Button>
        </form>
      </div>

      {/* Add New Option Modal */}
      {visible && (
        <Modal open={visible} onClose={closeHandler}>
          <Modal.Header>
            <h2 className="text-xl font-bold">
              Add New {optionType === "sizes" ? "Size" : "Color"}
            </h2>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={addNewOption} color="primary" auto>
              Add
            </Button>
            <Button onClick={closeHandler} color="error" auto>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default EditProduct;