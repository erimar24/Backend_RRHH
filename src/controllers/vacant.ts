import { Request, Response } from "express";
import { Vacant } from "../models/Vacant";
import Joi from "joi";
import { conn } from "../db/config";
import { QueryTypes } from "sequelize";


export async function all(req: Request, res: Response):
Promise<Response | void> {
    try {
        const vacants = await conn.query(`select * from vw_vacants`, {
          type: QueryTypes.SELECT,
        });
        res.status(200).json(vacants);
    } catch (error) {
        res.send(error);
    }
}


export async function single(
    req: Request, 
    res: Response
): Promise<Response | void> {
    try {
        const vacant = await Vacant.findOne({ where: { id: req.params.id}});
        //Sino la encontró
        if(!vacant) return res.send({ message: "Registro no encontrado"})
        //Si la ecnontró la muestra
        res.send(vacant);
    } catch (error) {
        res.send(error);
        console.log(error);
    }
}

export async function create(
    req: Request,
    res: Response
): Promise<Response | void>{
    let { vacancy_title, description, positionId } = req.body;

    //Defino el schema con las validaciones correspondientes
    const schema = Joi.object({
        vacancy_title: Joi.string().required(),
        description: Joi.string().required(),
        positionId: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send({
            Error: error.details.map((e) => {
                return e.message;
            })
        })
    }

    //Almacenamos el registro
    try {
        const vacant = await Vacant.create({
            vacancy_title,
            description,
            positionId
        });
        res.send(vacant);
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
        const vacant = await Vacant.findOne({ where: { id } });
        if(!vacant) return res.send({ message: "Registro no encontrado"});
        edit();
    } catch (error) {
        res.send({ error })
    }

    //Por medio de esta función se edita el registro
    async function edit() {
        try {
            let { 
                vacancy_title, 
                description, 
                positionId 
            } = req.body;

            //Defino el schema con las validaciones correpondientes
            const schema = Joi.object({
                id: Joi.optional(),
                vacancy_title: Joi.string().required(),
                description: Joi.string().required(),
                positionId: Joi.number().required(),
            });

            const { error } = schema.validate(req.body);

            if (error) {
                return res.status(400).send({
                    Error: error.details.map((e) => {
                      return e.message;
                    }),
                });
            }

            await Vacant.update(
                {
                    vacancy_title,
                    description,
                    positionId
                },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );
            res.status(200).json({ message: "Registro actualizado :)"});
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
        const vacant = await Vacant.findOne({ where: { id }});
        if(!vacant) return res.send({ message: "Registro no encontrado"});
        edit()
    } catch (error) {
        res.send({ error });
    }

    //Por medio de esta función se edita el registro
    async function edit() {
        try {
            //Defino el schema con las validaciones correspondientes
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

            await Vacant.update(
                {
                  status: false
                },
                {
                  where: {
                    id: req.params.id,
                  },
                }
            );
            res.status(200).json({ message: "Registro actualizado :)"});
        } catch (error) {
            res.send({ error });
        }
    }
}