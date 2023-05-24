import { Request, Response } from "express";
import { User } from "../models/User";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

export async function signIn(
  req: Request,
  res: Response
): Promise<Response | void> {
  const { username, password } = req.body;

  // Validar los campos
  const schema = Joi.object({
    username: Joi.string().max(60).required(),
    password: Joi.string().max(50).required(),
  }).options({ abortEarly: false });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      Error: error.details.map((e) => {
        return e.message;
      }),
    });

  try {
    const user = await User.findOne({
      where: { username },
      attributes: ["id", "username", "role"],
    });

    if (!user) return res.status(400).send("Usuario no registrado");

    const passwordToCompared: any = await User.findOne({
      where: {
        username,
      },
      attributes: ["password"],
    });

    const isPasswordValid = await compare(
      password,
      passwordToCompared.password
    );
    if (!isPasswordValid) return res.status(400).send("Contraseña invalida");

    // Si es usuario registrado se le genera su token
    const access_token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 4,
    });

    return res.status(200).send({
      user,
      access_token,
    });
  } catch (error) {
    res.send({ error });
  }
}
