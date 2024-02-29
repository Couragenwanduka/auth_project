import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import expressLayouts from 'express-ejs-layouts'
import expresssession from 'express-session';
import bodyParser from 'body-parser';
import env from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './userModel.js';
import connectdb from './db.js';
import bcrypt from 'bcryptjs';
connectdb();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload= multer()
env.config();
const app= express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(cookieParser());
app.use(upload.array());
app.use(expresssession({secret:"secret",resave:false,saveUninitialized:false}));

app.use(expressLayouts);
app.set('layout', __dirname +'/views/main'); // Correct setting for layout directory
app.set('view engine', 'ejs');



// Route to render the signup form
app.get('/signup', (req, res) => {
    // Render the signup form view
    res.render('signup');
});

// Route to handle user signup
app.post('/signup', async (req, res) => {
    try {
        // Extract user input from request body
        const { firstname, lastname, email, password } = req.body;

        // Check if all required fields are provided
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        } else {
            // Hash the password before saving it to the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user object
            const newUser = new User({
                firstName: firstname,
                lastName: lastname,
                email: email,
                password: hashedPassword,
            });

            // Save the new user to the database
            await newUser.save();
            // req.session.user = newUser;
            // res.redirect('signin')
            return res.status(200).json({message:"user saved successfully"})
            // Set the session user and render the signin page
            
        }
    } catch (error) {
        // If an error occurs during user signup, log it and return an error response
        console.error("Error saving user:", error);
        return res.status(500).json({ message: "Error saving user" });
    }
});


app.get('/signin', (req, res) => {
   
    res.render('signin');
})
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user in the database by email
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }else{
           
    //    return res.status(200).json({ message:'user successfully logged in' });
        // If passwords match, set user session and redirect to protected page
        // req.session.existingUser = existingUser;
        res.redirect('protected');
    }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
// function checkSignIn(req, res,next) {
//     if(req.session.user){
//        next();     //If session exists, proceed to page
//     } else {
//        var err = new Error("Not logged in!");
//        console.log(req.session.user);
//        next(err);  //Error, trying to access unauthorized page!
//     }}

app.get('/protected', (req, res) => {
    res.render('protected');
});

const port= 8000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
