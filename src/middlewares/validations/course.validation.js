// * ARCHIVO A COMPLETAR
// * Imports y courseIdValidation ya resueltos
import { body, param } from "express-validator";
import Course from "../../models/course.model.js";
import Topic from "../../models/topic.model.js";
import User from "../../models/user.model.js";

export const courseIdValidation = [
  param("id").isMongoId().withMessage("El ID del curso no es válido"),
];

export const createCourseValidation = [
  // TODO 1: de 3 a 100 caracteres y único (custom con una consulta a la base).
  body("title")
  .isLength({min:3, max:100}).withMessage("debe ser almenos de 3 a 100 caracteres").bail().custom(async (title) => {
    const titleExiste = await Course.findOne({title})
    if (titleExiste) {
      throw new Error("este title ya existe");
      
    }
  })
  , 

  // TODO 2: de 10 a 500 caracteres.
  body("description")
  .isLength({min:10, max:500}).withMessage("la descripction debe ser de al menos 10 a 500 caracteres")
  
  ,

  // TODO 3: opcional; valores permitidos: ["beginner", "intermediate", "advanced"].
  body("level")
  .optional().isIn(["beginner", "intermediate", "advanced"]).withMessage("debe ser al menos beginner,  intermediate o  advanced")
  , 
  
  // TODO 4: opcional; número mayor o igual a 0.
  body("price")
  .optional().isFloat({min:0}).withMessage("debe ser mayor o igual a 0 ")
  ,
  
  // TODO 5: valores permitidos: ["monday", "tuesday", "wednesday", "thursday", "friday"].
  body("schedule.day").notEmpty().withMessage("debe ser obligatory el dia").bail()
  .isIn(["monday", "tuesday", "wednesday", "thursday", "friday"])
  .withMessage("el dia debe ser entre monday, tuesday, wednesday, thursday o friday")
  ,

  // TODO 6: fecha válida (Date), obligatoria.
  body("schedule.startTime")
  .notEmpty()
    .withMessage("startTime es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("startTime debe ser una fecha válida (ej: 2026-11-05T10:00)"),
  // TODO 7: fecha válida (Date), obligatoria, y posterior a startTime (custom).
  body("schedule.endTime")
    .notEmpty()
    .withMessage("endTime es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("endTime debe ser una fecha válida (ej: 2026-11-05T12:00)")
    .bail()
    .custom((endTime, { req }) => {
      const fechaInicio = new Date(req.body.schedule.startTime);
      const fechaFin = new Date(endTime);
      if (fechaFin <= fechaInicio) {
        throw new Error("el endTime debe ser posterior al startTime");
      }
    }),

    // TODO 8: obligatorio; ID de MongoDB válido y el teacher debe existir y estar activo, es decir, con deletedAt null (custom).
  body("teacher")
    .notEmpty().withMessage("el teacher es obligatorio").bail().isMongoId().withMessage("el id del teacher debe ser valido").bail().
    custom(async (idTeacher) => {
      const teacher = await User.findOne({ _id: idTeacher, deletedAt: null });
      if (!teacher) {
        throw new Error("el teacher no existe o está eliminado");
      }
    }),

  // TODO 9: opcional; array cuyos IDs existan en la base (custom).
  body("topics")
  .optional().isArray().withMessage("topics debe ser arreglos").bail().custom(async (ids) => {
      const topicsEncontrados = await Topic.find({ _id: { $in: ids } });
      if (topicsEncontrados.length !== ids.length) {
        throw new Error("algunos topics no existen");
      }
    }),
  
];

export const updateCourseValidation = [
  // TODO 10: validar con isMongoId()
  param("id")
  .isMongoId().withMessage("el id debe ser valido"), 
  body("title"), // TODO 11: igual que en la creación, pero opcional. La unicidad debe excluir al propio curso.

  body("description"), // TODO 12: igual que en la creación, pero opcional.

  body("level"), // TODO 13: igual que en la creación, pero opcional (valores permitidos: ["beginner", "intermediate", "advanced"]).

  body("price"), // TODO 14: igual que en la creación, pero opcional.

  body("schedule.day"), // TODO 15: igual que en la creación, pero opcional (valores permitidos: ["monday", "tuesday", "wednesday", "thursday", "friday"]).

  body("schedule.startTime"), // TODO 16: igual que en la creación, pero opcional.

  body("schedule.endTime"), // TODO 17: igual que en la creación, pero opcional (y posterior a startTime si ambos llegan).

  body("teacher"), // TODO 18: igual que en la creación, pero opcional.

  body("topics"), // TODO 19: igual que en la creación, pero opcional.
];
