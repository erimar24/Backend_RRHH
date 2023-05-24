import { Request, Response } from "express";
import { Question } from "../models/Question";
import Joi from "joi";
import { Candidate } from "../models/Candidate";

export async function all(
    req: Request,
    res: Response
): Promise<Response | void> {
    try {
        const questions = await Question.findAll({
            where: {
                positionId: req.params.id,
                status: true,
            },
        });
        res.send(questions);
    } catch (error) {
        res.send({ error });
    }
}

export async function single(
    req: Request, 
    res: Response
): Promise<Response | void> {
    try {
        const question = await Question.findOne({ where: { id: req.params.id}});
        //Si no la encuentra
        if(!question) return res.send({ message: "Registro no encontrado"});
        //Si la encontró
        res.send(question);
    } catch (error) {
        res.send({ error });
    }
}

export async function create(
    req: Request,
    res: Response
): Promise<Response | void> {
    let { question, score } = req.body;

    //Validar los campos 
    const schema = Joi.object({
        question: Joi.string().required(),
        score: Joi.number().required(),
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
        const questionT = await Question.create({
            question,
            score,
            positionId: req.params.id,
        },
        );
        res.send(questionT)
    } catch (error) {
        res.send({ error });
    }
}

export async function update(
    req: Request, 
    res: Response
): Promise<Response | void> {
    try {
        const id = req.params.id;
        const question = await Question.findOne({ where: { id }});
        if (!question) return res.send({ message: "Registro no encontrado" });
    // Si existe el registro se llama a la función edit
    edit();
    } catch (error) {
        res.send({ error });
    }

    //Se edita el registro
    async function edit() {
        try {
            let { question, score } = req.body;

            //Validar los campos
            const schema = Joi.object({
                id: Joi.optional(),
                question: Joi.string().required(),
                score: Joi.number().required(),
            }).options({ abortEarly: false });

            const { error } = schema.validate(req.body);

            if (error) {
                return res.status(400).send({
                  Error: error.details.map((e) => {
                    return e.message;
                  }),
                });
            }

            await Question.update(
                { question, score },
                {
                    where: {
                    id: req.params.id,
                    },
                }
            );
            res.status(200).json({ message: "Registro actualizado con exito"});
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
        const question = await Question.findOne({ where: { id }});
        if(!question) return res.send({ message: "Registro no encontrado"});
        edit()
    } catch (error) {
        res.send({ error });
    }

    async function edit() {
        try {
            await Question.update(
                { status: false},
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );
            res.status(200).json({ message: "Registro actualizado correctamente"});
        } catch (error) {
            res.send({ error });
        }
    }
}

