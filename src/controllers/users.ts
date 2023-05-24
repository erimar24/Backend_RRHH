import { Request, Response } from "express";
import { User } from "../models/User";
// import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import Joi from "joi";

export async function all(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const users = await User.findAll({
      where: {
        status: true,
      },
    });
    res.send(users);
  } catch (error) {
    res.send({ error });
  }
}

export async function single(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    //Busca al usuario sino lo encuentra
    if (!user) return res.send({ message: "El usuario no existe en la base" });

    //Si lo encuentra lo muestra
    res.status(200).json(user);

  } catch (error) {
    res.send({ error });
  }

}

export async function create(
  req: Request,
  res: Response
): Promise<Response | void> {
  let {
    username, password, role
  } = req.body;

  // Defino el schema con las validaciones correspondientes
  const schema = Joi.object({
    username: Joi.string().max(60).required(),
    password: Joi.string().max(50).required(),
    role: Joi.string().max(50).required(),
  }).options({ abortEarly: false });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      Error: error.details.map((e) => {
        return e.message;
      }),
    });

  // Almacenar el registro
  try {
    const user = await User.findOne({ where: { username } });
    if (user) return res.status(400).send("Nombre de usuario ya registrado");

    const hashedPassword = await hash(password, 10);
    const users = await User.create({
      username,
      password: hashedPassword,
      role,
    });
    res.send(users);
  } catch (error) {
    res.send({ error: "Algo salió mal" });
  }
}

export async function update(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const id = req.params.id;
    const user = await User.findOne({ where: { id } });
    if (!user) return res.send({ message: "Registro no encontrado" });
    edit();
  } catch (error) {
    res.send({ error });
  }

  async function edit() {
    try {
      let { username, password, role } = req.body;

      //Validamos los campos
      const schema = Joi.object({
        username: Joi.string().max(60).required(),
        password: Joi.string().max(50).required(),
        role: Joi.string().max(50).required(),
      }).options({ abortEarly: false });

      const { error } = schema.validate(req.body);

      if (error) {
        return res.status(400).send({
          Error: error.details.map((e) => {
            return e.message;
          }),
        });
      }

      const hashedPassword = await hash(password, 10);
      await User.update(
        {
          username,
          password: hashedPassword,
          role,
        },
        {
          where: {
            id: req.params.id,
          }
        }
      );
      res.status(200).json({ message: "Registro actualizado con exito" });

    } catch (error) {
      res.send({ error });
    }
  }
}

export async function deactivate(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const id = req.params.id;
    const user = await User.findOne({ where: { id } });
    if (!user) return res.send({ message: "Registro no encontrado" });
    edit()
  } catch (error) {
    res.send({ error });
  }

  async function edit() {
    try {
      await User.update(
        { status: false },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ message: "Registro eliminado correctamente" });
    } catch (error) {
      res.send({ error });
    }
  }
}
