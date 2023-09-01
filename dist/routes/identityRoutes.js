"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const identityController_1 = require("../controllers/identityController");
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        const result = await (0, identityController_1.identifyContact)(req, res);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("=====>", "error");
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = router;
