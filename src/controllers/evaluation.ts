import { Request, Response } from "express";
import { Evaluation } from "../models/Evaluation";
import { Candidate } from "../models/Candidate";
import Joi from "joi";
import { conn } from "../db/config";
import { QueryTypes } from "sequelize";

/************************************************ CRUD *************************************************/
export async function all(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const evaluations = await conn.query(
      `Select * from vw_evaluations where vacantId = ${req.params.id}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json(evaluations);
  } catch (error) {
    res.send({ error });
  }
}

export async function report(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const reports = await conn.query(
      `Select * from vw_report where vacantId = ${req.params.id}`, 
      {
      type: QueryTypes.SELECT,
    });
    res.status(200).json(reports);
  } catch (error) {
    res.send(error);
  }
}

export async function single(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const evaluation = await Evaluation.findOne({
      where: { id: req.params.id },
    });
    //Sino la encuentra
    if (!evaluation) return res.send({ message: "Registro no encontrado" });
    //Si la encontró
    res.send(evaluation);
  } catch (error) {
    res.send({ error });
  }
}

export async function allCandidates(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const candidates = await Candidate.findAll({
      where: {
        vacantId: req.params.id,
        status: true,
      },
    });
    res.send(candidates);
  } catch (error) {
    res.send({ error });
  }
}

export async function addCandidate(
  req: Request,
  res: Response
): Promise<Response | void> {
  let {
    fa_level,
    fa_ability,
    exp_general,
    exp_spicify,
    interview,
    vacantId,
    candidateId,
    tecnhinal_test,
  } = req.body;

  console.log(req.body);
  const schema = Joi.object({
    vacantId: Joi.number(),
    fa_level: Joi.number(),
    fa_ability: Joi.number(),
    exp_general: Joi.number(),
    exp_spicify: Joi.number(),
    interview: Joi.number(),
    tecnhinal_test: Joi.number(),
    candidateId: Joi.number().required(),
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
    const candidate = await Evaluation.create({
      fa_level,
      fa_ability,
      exp_general,
      exp_spicify,
      interview,
      tecnhinal_test,
      vacantId,
      candidateId,
    });
    res.send(candidate);
  } catch (error) {
    res.send({ error });
  }
}

export async function addEvaluation(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const id = req.params.id;
    const evaluation = await Evaluation.findOne({ where: { id } });
    if (!evaluation) return res.send({ message: "Registro no encontrado" });
    // Si existe el registro se llama a la función edit
    edit();
  } catch (error) {
    res.send({ error });
  }

  //Se editarán los datos de la evaluación
  async function edit() {
    try {
      let {
        fa_level,
        fa_ability,
        exp_general,
        exp_spicify,
        interview,
        tecnhinal_test,
        vacantId,
        candidateId,
      } = req.body;
      console.log(req.body);

      //Validamos los campos
      const schema = Joi.object({
        id: Joi.optional(),
        vacantId: Joi.number().required(),
        fa_level: Joi.number().required(),
        fa_ability: Joi.number().required(),
        exp_general: Joi.number().required(),
        exp_spicify: Joi.number().required(),
        interview: Joi.number().required(),
        candidateId: Joi.number().required(),
        tecnhinal_test: Joi.number().required(),
      }).options({ abortEarly: false });

      const { error } = schema.validate(req.body);

      if (error) {
        return res.status(400).send({
          Error: error.details.map((e) => {
            return e.message;
          }),
        });
      }

      await Evaluation.update(
        {
          fa_level,
          fa_ability,
          exp_general,
          exp_spicify,
          interview,
          tecnhinal_test,
          vacantId,
          candidateId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ message: "Registro creado con exito" });
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
    const evaluation = await Evaluation.findOne({ where: { id } });
    if (!evaluation) return res.send({ message: "Registro no encontrado" });
    edit();
  } catch (error) {
    res.send({ error });
  }

  async function edit() {
    try {
      await Evaluation.update(
        { status: false },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ message: "Registro actualizado correctamente" });
    } catch (error) {
      res.send({ error });
    }
  }
}
