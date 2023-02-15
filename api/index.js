const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/user');
const postRoute = require('./routes/posts');
const authRoute = require('./routes/auth');
const multer = require("multer");
const path = require("path")

const app = express();
const PORT = 3000;

dotenv.config();
mongoose.set('strictQuery', false);



mongoose.connect(
    process.env.MONGOR_URL
    , { useNewUrlParser: true },
    () => {
        console.log('conectado a MongoBD');
    }
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded ");
    } catch (err) {
        console.log(err);
    }
});

app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/user', userRoute);

app.listen(PORT, () => {
    console.log('Backend server corriendo fauno sos un crack!')
});