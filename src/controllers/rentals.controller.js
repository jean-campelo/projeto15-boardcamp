import joi from "joi";
import connection from "../database.js";

const solicitationRentalSchema = joi.object({
  customerId: joi.number().required(),
  gameId: joi.number().required(),
  daysRented: joi.number().required().positive(),
});

async function GetRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const validationRental = solicitationRentalSchema.validate(req.body, {
    abortEarly: false,
  });
  if (validationRental.error) {
    const errors = validationRental.error.details.map(
      (detail) => detail.message
    );
    return res.status(400).send(errors);
  }

  //validation customerId
  const userExisting = await connection.query(
    "SELECT * FROM customers WHERE id = $1;",
    [customerId]
  );
  if (userExisting.rows.length === 0) {
    return res.status(400).send(`Do not exists client with id "${customerId}"`);
  }

  //validation gameId
  const gameExisting = await connection.query(
    "SELECT * FROM customers WHERE id = $1;",
    [gameId]
  );
  if (gameExisting.rows.length === 0) {
    return res.status(400).send(`Do not exists game with id "${gameId}"`);
  }

  res.sendStatus(201);
}

export { GetRentals };