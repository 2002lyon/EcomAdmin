import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

const ProductForm = ({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) => {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const saveProduct = async (e) => {
    e.preventDefault();
    const data = { title, description, price, images };
    if (_id) {
      //update product
      await axios.put("/api/products", { ...data, _id });
      setGoToProducts(true);
    } else {
      try {
        await axios.post("/api/products", data);
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
    setGoToProducts(true);
  };

  const updateImagesOrder = (images) => {
    console.log("images from update Image order function", images);
    setImages([...images]);
  };

  useEffect(() => {
    if (goToProducts) {
      router.push("/products", undefined, { shallow: false });
    }
  }, [goToProducts]);

  const uploadImages = async (e) => {
    const files = e.target?.files;

    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      try {
        const res = await axios.post("/api/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const uploadedImageUrl = res.data.url; // Get the URL of the uploaded

        // Update state with the new image URL
        setImages((prevImages) => [...prevImages, uploadedImageUrl]);
        // console.log("images from the upload function", images);
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={saveProduct}>
      <label htmlFor="">Product name</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="">Product Image</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-2"
        >
          {!!images?.length &&
            images.map((link, i) => {
              console.log("link", link);
              console.log("link with string ", link.toString());

              return (
                <div key={i} className="relative w-24 h-24">
                  <Image
                    src={link.toString()}
                    alt={link ? link : "No link available"}
                    fill // Makes the image responsive
                    style={{ objectFit: "cover" }}
                    unoptimized // Disable Next.js optimization for external images
                    className="rounded-lg"
                  />
                </div>
              );
            })}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 text-center flex flex-col items-center cursor-pointer justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
        {!images?.length && <div>No photos for this product</div>}
      </div>
      <label htmlFor="">Description</label>
      <textarea
        // placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label htmlFor="">Price</label>
      <input
        type="number"
        className=""
        // placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  );
};

export default ProductForm;
