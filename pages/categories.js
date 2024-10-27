import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

const Categories = ({ swal }) => {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);

  const saveCategory = async (e) => {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    fetchCategories();
    setName("");
    setParentCategory("");
    setProperties([]);
  };

  const fetchCategories = () => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id ? category.parent?._id : "");
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  };

  const deleteCategory = (category) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete the category "${category.name}"?`,
        showCancelButton: true,
        cancelButtonText: "cancel",
        confirmButtonText: "delete",
        reverseButtons: true,
        confirmButtonColor: "#b91c1c",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  };

  const addProperty = () => {
    setProperties((prev) => {
      return [...prev, { name: "", value: "" }];
    });
  };

  const handlePropertyNameChange = (i, property, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[i].name = newName;
      return properties;
    });
  };
  const handlePropertyValuesChange = (i, property, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[i].values = newValues;
      return properties;
    });
  };

  const removeProperty = (indexToRemove) => {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
      <h1>Categories</h1>
      <label htmlFor="">
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            className=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className=""
            value={parentCategory}
            onChange={(e) => {
              console.log("e.target.value", e.target.value);
              setParentCategory(e.target.value);
              console.log("parentCategory", parentCategory);
            }}
          >
            <option value="">No main category</option>
            {categories.length > 0 &&
              categories.map((category, i) => (
                <option key={i} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm mb-2"
            onClick={() => addProperty()}
          >
            Add new properties
          </button>
          {properties.length > 0 &&
            properties.map((property, i) => (
              <div className="flex gap-1 mb-2" key={i}>
                <input
                  type="text"
                  className="mb-0"
                  value={property.name}
                  placeholder="property name (example: color)"
                  onChange={(e) =>
                    handlePropertyNameChange(i, property, e.target.value)
                  }
                />
                <input
                  value={property.values}
                  type="text"
                  className="mb-0"
                  placeholder="property value, comma seperated"
                  onChange={(e) =>
                    handlePropertyValuesChange(i, property, e.target.value)
                  }
                />

                <button
                  className="btn-default"
                  onClick={() => removeProperty(i)}
                  type="button"
                >
                  remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              className="btn-default py-0"
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              cancel
            </button>
          )}

          <button className="btn-primary py-0" type="submit">
            Save
          </button>
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Main Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category, i) => (
                <tr key={i}>
                  <td>{category.name}</td>
                  <td>
                    {category?.parent?.name ? category?.parent?.name : ""}
                  </td>
                  <td>
                    <button
                      className="btn-default mr-1"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => deleteCategory(category)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
