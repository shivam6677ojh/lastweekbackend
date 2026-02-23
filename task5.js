const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/lastweekbackend";

mongoose
	.connect(MONGODB_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((error) => console.error("MongoDB connection error:", error));

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		price: { type: Number, required: true, min: 0 }
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

// Get all products
app.get("/products", async (req, res) => {
	try {
		const products = await Product.find().lean();
		res.json(products);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch products." });
	}
});

// Create product
app.post("/products", async (req, res) => {
	try {
		const { name, price } = req.body;
		if (!name || typeof price !== "number") {
			return res.status(400).json({ message: "Name and price are required." });
		}

		const product = await Product.create({ name, price });
		return res.status(201).json(product);
	} catch (error) {
		return res.status(500).json({ message: "Failed to create product." });
	}
});

// Update product by id
app.put("/products/:id", async (req, res) => {
	try {
		const { name, price } = req.body;
		if (!name || typeof price !== "number") {
			return res.status(400).json({ message: "Name and price are required." });
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{ name, price },
			{ new: true, runValidators: true }
		);

		if (!updatedProduct) {
			return res.status(404).json({ message: "Product not found." });
		}

		return res.json(updatedProduct);
	} catch (error) {
		return res.status(500).json({ message: "Failed to update product." });
	}
});

// Delete product by id
app.delete("/products/:id", async (req, res) => {
	try {
		const deletedProduct = await Product.findByIdAndDelete(req.params.id);
		if (!deletedProduct) {
			return res.status(404).json({ message: "Product not found." });
		}
		return res.json({ message: "Product deleted." });
	} catch (error) {
		return res.status(500).json({ message: "Failed to delete product." });
	}
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
