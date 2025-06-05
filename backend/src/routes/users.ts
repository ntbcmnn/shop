import { Router, Request, Response } from "express";

import auth, { RequestWithUser } from "../middleware/auth";
import {
    checkPassword,
    createUser,
    findUserByEmail,
    generateNewToken,
} from "../models/User";

const userRouter = Router();

userRouter.post("/register", async (req: Request, res: Response) => {
    const { email, password, first_name, last_name, phone, role } = req.body;

    const userRole = role ? role.toUpperCase() : 'USER';

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        res.status(400).json({ error: "Email уже зарегистрирован" });
        return;
    }

    const newUser = await createUser(email, password, first_name, last_name, userRole, phone);

    res.status(201).json({
        user: {
            id: newUser.id,
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            phone: newUser.phone,
            role: newUser.role,
            token: newUser.token,
        },
    });
});

userRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        res.status(401).json({ error: "Неверные данные для входа" });
        return;
    }

    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
        res.status(401).json({ error: "Неверные данные для входа" });
        return;
    }

    const newToken = await generateNewToken(user.id);

    res.json({
        user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            token: newToken,
            role: user.role,
        },
    });
});

userRouter.get("/profile", auth, async (req: RequestWithUser, res: Response) => {
    res.json({
        id: req.user!.id,
        email: req.user!.email,
        first_name: req.user!.first_name,
        last_name: req.user!.last_name,
        phone: req.user!.phone,
        role: req.user!.role,
    });
});

export default userRouter;
