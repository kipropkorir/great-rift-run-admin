"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

// Updated interface without size
interface ProductFormData {
    category: string;
    name: string;
    description: string;
    inStock: number;
    price: number;
    color: string;
    material: string;
    images: string[];
    imageFiles: File[];
}

export default function AddProduct() {
    const [formData, setFormData] = useState<ProductFormData>({
        category: "TSHIRTS",
        name: "",
        description: "",
        inStock: 0,
        price: 0,
        color: "",
        material: "",
        images: [],
        imageFiles: [],
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) : value,
        }));
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const remainingSlots = 4 - formData.images.length;
            if (remainingSlots <= 0) {
                alert("Maximum 4 images allowed");
                return;
            }

            const filesArray = Array.from(files).slice(0, remainingSlots);
            const newImageUrls = filesArray.map(file => URL.createObjectURL(file));
            
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...newImageUrls],
                imageFiles: [...prev.imageFiles, ...filesArray],
            }));
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
            imageFiles: prev.imageFiles.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        
        // Add basic product data
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'images' && key !== 'imageFiles') {
                formDataToSend.append(key, String(value));
            }
        });
        
        // Add images
        formData.imageFiles.forEach((file, index) => {
            formDataToSend.append(`image${index}`, file);
        });

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                body: formDataToSend,
            });

            const responseData = await response.json();
            
            if (response.ok) {
                alert("Product added successfully!");
                setFormData({
                    category: "TSHIRTS",
                    name: "",
                    description: "",
                    inStock: 0,
                    price: 0,
                    color: "",
                    material: "",
                    images: [],
                    imageFiles: [],
                });
            } else {
                alert(`Failed to add product: ${JSON.stringify(responseData, null, 2)}`);
            }
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const renderCategorySpecificFields = () => {
        switch (formData.category) {
            case "TSHIRTS":
            case "HOODIES":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Color</label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Material</label>
                            <input
                                type="text"
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-6">Add Product</h1>
            <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
                >
                    <option value="TSHIRTS">TSHIRTS</option>
                    <option value="HOODIES">HOODIES</option>
                    <option value="CAPS">CAPS</option>
                    <option value="WATER">WATER</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">In Stock</label>
                    <input
                        type="number"
                        name="inStock"
                        value={formData.inStock}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
                    />
                </div>
            </div>
            {renderCategorySpecificFields()}
            <div className="mb-4">
                <label className="block text-gray-700">
                    Upload Images ({formData.images.length}/4)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
                />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((url, index) => (
                        <div key={index} className="relative">
                            <Image
                                src={url}
                                height={160}
                                width={160}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-32 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded shadow hover:bg-blue-600 focus:outline-none"
            >
                Add Product
            </button>
        </form>
    );
}