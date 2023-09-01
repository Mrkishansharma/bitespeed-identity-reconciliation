import express, { Request, Response } from "express";
import { identifyContact } from "../controllers/identityController";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const result = await identifyContact(req, res);
    res.status(200).json(result);
  } catch (error) {
    console.error("=====>", "error");
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
