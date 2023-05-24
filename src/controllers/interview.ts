import { Request, Response } from "express";
import { Interview } from "../models/Interview";
import Joi from "joi";

export async function all(
    req: Request, 
    res: Response
): Promise<Response | void> {
    try {
        const interviews = await Interview.findAll({
            where: {
                status: true,
            }
        });
        res.send( interviews );
    } catch (error) {
        res.send({ error })
    }
}

export async function single(
    req: Request,
    res: Response,
): Promise <Response | void> {
    try {
        const interview = await Interview.findOne({ where: {id: req.params.id}});
        //Sino la encuentra
        if(!interview) return res.send({ message: "Registro no encontrado"});
        //Si la encuentra y la muestra
        res.send(interview);
    } catch (error) {
        res.send({ error });
    }
}

export async function create (
    req: Request,
    res: Response
): Promise<Response | void> {
    let { 
        question,
        score
    } = req.body;

    //Defino el schema con las validaciones correspondientes
    const schema = Joi.object({
        question: Joi.string().required(),
        score: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    if(error) {
        return res.status(400).send({
            Error: error.details.map((e) => {
                return e.message;
            })
        })
    }

    //Almacenamos el registro 
    try {
        const interview = await Interview.create({
            question,
            score
        });
        res.send(interview)
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
        const interview = await Interview.findOne({ where: { id }});
        if (!interview) return res.send({ message: "Registro no encontrado"});
        edit()
    } catch (error) {
        res.send({ error });
    }

    //Por medio de esta función se edita el registro
    async function edit() {
        try {
            //Defino el body con los campos
            let {
                question,
                score
            } = req.body;

            //Defino el schema con las validaciones correspondientes
            const schema = Joi.object({
                id: Joi.optional(),
                question: Joi.string().max(200).required(),
                score: Joi.number().required(),
            }).options({ abortEarly: false });

            const { error } = schema.validate(req.body);

            if(error) {
                console.log(error)
                return res.status(400).send({
                    Error: error.details.map((e) => {
                        return e.message
                    })
                })
            }

            await Interview.update(
                {
                    question,
                    score
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
        const  interview = await Interview.findOne({ where: { id }});
        edit()
    } catch (error) {
        res.send({ error });
    }

    //Por medio de esta función se edita el registro
    async function edit() {
        try {
            //Defino el schema con las validaciones
            const schema = Joi.object({
                id: Joi.number().required()
            });

            const { error } = schema.validate(req.params);

            if (error) {
                return res.status(400).send({
                Error: error.details.map((e) => {
                    return e.message;
                }),
                });
            }

            await Interview.update(
                {
                    status: false,
                },
                {
                    where: {
                        id: req.params.id,
                    }
                }
            );
            res.status(200).json({ message: "Registro actualizado :)" });
        } catch (error) {
        res.send({ error });
        }
    }
}