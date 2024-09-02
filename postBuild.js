// postBuild.js
const fs = require("fs");
const path = require("path");

// Define the path and content of the text file
const filePath = path.join(__dirname, "dist", "f0376da7f120f73754dd1472c4a5d7e8.txt");
const fileContent = "";

// Write the file to the dist directory
fs.writeFile(filePath, fileContent, (err) => {
  if (err) {
    console.error("Error creating build-info.txt:", err);
  } else {
    console.log("build-info.txt created successfully!");
  }
});
