const express = require ('express')
const app = express()
const path = require ('path')
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.static( path.join ( __dirname , 'public' ) ))
app.use(express.json())
app.use(express.urlencoded( { extended: true }))



app.get("/", function (req, res) {
    fs.readdir("./files", { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading directory");
            return;
        }

        // Initialize an array to hold the file data
        let data = [];

        // Process each file
        files.forEach((file) => {
            // Construct the full file path
            const filePath = path.join(__dirname, "files", file.name);

            // Read the file content
            fs.readFile(filePath, "utf8", (readErr, fileContent) => {
                if (readErr) {
                    console.error(readErr);
                    // Handle error reading the file
                    return;
                }

                // Prepare the file data
                const fileData = {
                    name: file.name,
                    description: fileContent,
                };

                // Add the file data to the array
                data.push(fileData);

                // After all files are processed, render the view
                if (data.length === files.length) {
                    res.render("index", { title: "homepage", data });
                }
            });
        });
    });
});

// script.js

app.post('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'files', filename);

    fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
            console.error(unlinkErr);
            res.status(500).send('Error deleting file');
        } else {
            res.redirect('/');
        }
    });
});

app.get("/create", (req,res)=> {
    res.render('create')
})

app.post("/create", (req, res)=> {
    //  const filename = req.body.filename;
    // const description = req.body.description;

    fs.writeFile(`./files/${req.body.filename}`, req.body.description, err =>{
        if(err) console.log(err)
            else {
                console.log("file written succesfully")
            }
    })
})


app.listen(3000)