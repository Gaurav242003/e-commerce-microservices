const pool = require('../database/connectionDB');

const createPayment = async (payment) => {
  const query = `
    INSERT INTO payments (
      id, order_id, user_id, amount, currency,
      status, payment_method, idempotency_key
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
  `;

  const values = [
    payment.id,
    payment.orderId,
    payment.userId,
    payment.amount,
    payment.currency,
    payment.status,
    payment.paymentMethod,
    payment.idempotencyKey
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findByIdempotencyKey = async (key) => {
  const { rows } = await pool.query(
    "SELECT * FROM payments WHERE idempotency_key = $1",
    [key]
  );
  return rows[0];
};

const findById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM payments WHERE id = $1",
    [id]
  );
  return rows[0];
};

module.exports = {
  createPayment,
  findById,
  findByIdempotencyKey
};
