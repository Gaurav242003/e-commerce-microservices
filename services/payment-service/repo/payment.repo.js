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
    `SELECT * FROM payments WHERE idempotency_key = $1::text`,
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

const updatePaymentStatus = async (id, status, extraFields = {}) => {
  const fields = [];
  const values = [];
  let idx = 1;

  // Optional: whitelist allowed columns
  const allowedFields = new Set([
    'amount',
    'currency',
    'provider_payment_id',
    'provider',
    'failure_reason'
  ]);

  for (const key in extraFields) {
    if (!allowedFields.has(key)) {
      throw new Error(`Invalid field: ${key}`);
    }

    fields.push(`${key} = $${idx}`);
    values.push(extraFields[key]);
    idx++;
  }

  // Always update status
  fields.push(`status = $${idx}`);
  values.push(status);
  idx++;

  // id for WHERE clause
  values.push(id);

  const query = `
    UPDATE payments
    SET ${fields.join(', ')},
        updated_at = NOW()
    WHERE id = $${idx}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findByProviderPaymentId = async (providerPaymentId) => {
  const {rows} = await pool.query(
    'SELECT * FROM payments WHERE provider_payment_id = $1::text',
    [providerPaymentId]
  )

  return rows[0];
}



module.exports = {
  createPayment,
  findById,
  findByIdempotencyKey,
  updatePaymentStatus,
  findByProviderPaymentId
};
