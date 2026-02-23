const express = require("express");

const app = express();
app.use(express.json());

let students = [
    { id: 1, name: "Alice", age: 21, course: "Math" },
    { id: 2, name: "Bob", age: 22, course: "Physics" }
];

const getNextId = () => {
    const maxId = students.reduce((max, student) => Math.max(max, student.id), 0);
    return maxId + 1;
};

const parseStudentId = (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        res.status(400).json({ message: "Invalid student id." });
        return null;
    }
    return id;
};

// Create Student
app.post("/students", (req, res) => {
    const { name, age, course } = req.body;
    if (!name || !age || !course) {
        return res.status(400).json({ message: "name, age, and course are required." });
    }

    const newStudent = {
        id: getNextId(),
        name,
        age,
        course
    };

    students.push(newStudent);
    return res.status(201).json(newStudent);
});

// Get All Students
app.get("/students", (req, res) => {
    res.json(students);
});

// Get Student by ID
app.get("/students/:id", (req, res) => {
    const id = parseStudentId(req, res);
    if (id === null) return;

    const student = students.find((item) => item.id === id);
    if (!student) {
        return res.status(404).json({ message: "Student not found." });
    }

    return res.json(student);
});

// Update Student
app.put("/students/:id", (req, res) => {
    const id = parseStudentId(req, res);
    if (id === null) return;

    const studentIndex = students.findIndex((item) => item.id === id);
    if (studentIndex === -1) {
        return res.status(404).json({ message: "Student not found." });
    }

    const { name, age, course } = req.body;
    if (!name || !age || !course) {
        return res.status(400).json({ message: "name, age, and course are required." });
    }

    const updatedStudent = { id, name, age, course };
    students[studentIndex] = updatedStudent;
    return res.json(updatedStudent);
});

// Delete Student
app.delete("/students/:id", (req, res) => {
    const id = parseStudentId(req, res);
    if (id === null) return;

    const studentIndex = students.findIndex((item) => item.id === id);
    if (studentIndex === -1) {
        return res.status(404).json({ message: "Student not found." });
    }

    const deletedStudent = students.splice(studentIndex, 1)[0];
    return res.json(deletedStudent);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


