const express = require("express");

const app = express();
app.use(express.json());

let products = [
	{ id: 1, name: "Laptop", price: 35000 },
	{ id: 2, name: "Phone", price: 20000 }
];

const loggingMiddleware = (req, res, next) => {
	console.log("Middleware called");
	console.log(`Api Info : ${req.method} ${req.path}`);
	next();
};

const validateProductMiddleware = (req, res, next) => {
	const { name, price } = req.body;
	if (!name || typeof price !== "number") {
		return res.status(400).json({ message: "Name and price are required." });
	}
	return next();
};

app.use(loggingMiddleware);

// Get all products
app.get("/products", (req, res) => {
	res.json(products);
});

// Create product
app.post("/products", validateProductMiddleware, (req, res) => {
	const { name, price } = req.body;
	const nextId = products.reduce((max, item) => Math.max(max, item.id), 0) + 1;
	const newProduct = { id: nextId, name, price };
	products.push(newProduct);
	res.status(201).json(newProduct);
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
