import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { routes } from "./routes/index";


import dotenv from "dotenv";
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5010;

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",async(req,res)=>{
  res.send("api running")
})
routes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
