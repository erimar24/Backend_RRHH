import { Request, Response } from "express";
import { Position } from "../models/Position";
import Joi from "joi";

/************************************************ CRUD *************************************************/
export async function all(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const stalls = await Position.findAll({
      where: {
        status: true,
      },
    });
    res.send(stalls);
  } catch (error) {
    res.send({ error });
  }
}


export async function single(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const position = await Position.findOne({ where: { id: req.params.id } });
    // Si no la encontró
    if (!position) return res.send({ message: "Registro no encontrado" });
    // Si la encontró 
    res.send(position);
  } catch (error) {
    res.send({ error });
  }
}


export async function create(
  req: Request,
  res: Response
): Promise<Response | void> {
  let { name, career, academic_level, experience, description } = req.body;

  //Validar los campos
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    career: Joi.string().max(100).required(),
    academic_level: Joi.string().max(200).required(),
    experience: Joi.string().max(200).required(),
    description: Joi.string().required(),
  }).options({ abortEarly: false });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      Error: error.details.map((e) => {
        return e.message;
      }),
    });
  }

  //Almacenamos el registro
  try {
    const position = await Position.create({
      name,
      career,
      academic_level,
      experience,
      description,
    });
    res.send(position);
  } catch (error) {
    res.send({ error });
  }
}


export async function update(
  req: Request, 
  res: Response
  ): Promise<Response | void> {
  // Se busca que el registro exista
  try {
    const id = req.params.id;
    const position = await Position.findOne({ where: { id } });
    if (!position) return res.send({ message: "Registro no encontrado" });
    // Si existe el registro se llama a la función edit
    edit();
  } catch (error) {
    res.send({ error });
  }

 // Se edita el registro
  async function edit() {
    try {
      let { name, career, academic_level, experience, description } = req.body;

      //Validar los campos
      const schema = Joi.object({
        id: Joi.optional(),
        name: Joi.string().max(50).required(),
        career: Joi.string().max(100).required(),
        academic_level: Joi.string().max(200).required(),
        experience: Joi.string().max(200).required(),
        description: Joi.string().required(),
      }).options({ abortEarly: false });

      const { error } = schema.validate(req.body);

      if (error) {
        return res.status(400).send({
          Error: error.details.map((e) => {
            return e.message;
          }),
        });
      }

      await Position.update(
        { name, career, academic_level, experience, description },
        {
          where: {
            id: req.params.id,
          },
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
    const position = await Position.findOne({ where: { id } });
    if (!position) return res.send({ message: "Registro no encontrado" });
    edit();
  } catch (error) {
    res.send({ error });
  }

  async function edit() {
    try {
      await Position.update(
        { status: false },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ message: "Registro actualizado con exito" });
    } catch (error) {
      res.send({ error });
    }
  }
}
