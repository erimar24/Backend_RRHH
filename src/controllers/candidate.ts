import { Request, Response } from "express";
import { Candidate } from "../models/Candidate";
import Joi from "joi";
import { conn } from "../db/config";
import { QueryTypes } from "sequelize";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function all(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const products = await conn.query(`select * from vw_candidates`, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json(products);
  } catch (error) {
    res.send(error);
  }
}

export async function allByPosition(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const products = await conn.query(`select * from vw_candidates where positionId = ${req.params.id}`, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json(products);
  } catch (error) {
    res.send(error);
  }
}

export async function single(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const candidate = await Candidate.findOne({ where: { id: req.params.id } });
    //Busca al candidato sino lo encuentra
    if (!candidate) return res.send({ message: "El candidato no existe" });

    // Si lo encuentra lo muestra
    res.status(200).json(candidate);
  } catch (error) {
    res.send({ error });
  }
}

export async function create(
  req: Request,
  res: Response
): Promise<Response | void> {
  // @ts-ignore
  const cvFilePath = req.files['cv'][0].path;
  // @ts-ignore
  const cvFileName = `${uuidv4()}-${req.files['cv'][0].originalname}`;
  const updatedCvFilePath = path.join(__dirname, "../public", cvFileName);
  fs.renameSync(cvFilePath, updatedCvFilePath);

  // @ts-ignore
  const jobApplicationFilePath = req.files['job_application'][0].path;
  // @ts-ignore
  const jobApplicationFileName = `${uuidv4()}-${req.files['job_application'][0].originalname}`;
  const updatedJobApplicationFilePath = path.join(__dirname, "../public", jobApplicationFileName);
  fs.renameSync(jobApplicationFilePath, updatedJobApplicationFilePath);

  let {
    positionId,
    name,
    lastname,
    birthdate,
    phone,
    academic_level,
    experience,
    place,
  } = req.body;

  const schema = Joi.object({
    name: Joi.string().required(),
    positionId: Joi.number().required(),
    lastname: Joi.string().required(),
    birthdate: Joi.date().max("now").iso().required(),
    phone: Joi.number().required(),
    academic_level: Joi.string().required(),
    experience: Joi.string().required(),
    place: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      Error: error.details.map((e) => {
        return e.message;
      }),
    });
  }

  try {
    const candidate = await Candidate.create({
      positionId,
      name,
      lastname,
      birthdate,
      phone,
      academic_level,
      experience,
      place,
      cv: cvFileName,
      job_application: jobApplicationFileName,
    });
    res.send(candidate);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
}

export async function update(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const id = req.params.id;
    const candidate = await Candidate.findOne({ where: { id } });
    if (!candidate) return res.send({ message: "Registro no encontrado" });
    edit();
  } catch (error) {
    res.send({ error });
  }

  async function edit() {
    // @ts-ignore
    let fileName = null;
    // @ts-ignore
    if (req.file) {
      // @ts-ignore
      const filePath = req.file.path;
      // @ts-ignore
      fileName = uuidv4() + "-" + req.file.originalname;
      const updatedFilePath = path.join(__dirname, "../public", fileName);
      fs.renameSync(filePath, updatedFilePath);
    }

    try {
      //Defino el body con los campos
      let {
        positionId,
        name,
        lastname,
        birthdate,
        phone,
        academic_level,
        experience,
        place,
      } = req.body;

      //Defino el schema con las validaciones correspondientes
      const schema = Joi.object({
        id: Joi.optional(),
        positionId: Joi.number().required(),
        name: Joi.string().required(),
        lastname: Joi.string().required(),
        birthdate: Joi.date().max("now").iso().required(),
        phone: Joi.number().required(),
        academic_level: Joi.string().required(),
        experience: Joi.string().required(),
        place: Joi.string().required(),
        cv: Joi.optional(),
        job_application: Joi.optional()
      });

      const { error } = schema.validate(req.body);

      if (error) {
        return res.status(400).send({
          Error: error.details.map((e) => {
            return e.message;
          }),
        });
      }

      await Candidate.update(
        {
          positionId,
          name,
          lastname,
          birthdate,
          phone,
          academic_level,
          experience,
          place,
          ...(fileName ? { cv: fileName } : {}),
          ...(fileName ? { job_application: fileName } : {}),
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ message: "Registro actualizado :)" });
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
    const candidate = await Candidate.findOne({ where: { id } });
    if (!candidate) return res.send({ message: "Registro no encontrado" });
    edit();
  } catch (error) {
    res.send({ error });
  }

  //Por medio de esta función se edita el registro
  async function edit() {
    try {
      //Defino el schema con las validaciones correspondientes
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error } = schema.validate(req.params);

      if (error) {
        return res.status(400).send({
          Error: error.details.map((e) => {
            return e.message;
          }),
        });
      }

      await Candidate.update(
        {
          status: false,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ message: "Registro actualizado :)" });
    } catch (error) {
      res.send({ error });
    }
  }
}
