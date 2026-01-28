// repo/order.repo.js
const pool = require('../database/connectionDB');
const { v4: uuidv4 } = require("uuid");

const createOrder = async ({
  id,
  userId,
  status,
  totalAmount,
  currency,
  items,
  idempotencyKey
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Idempotency check
    const existing = await client.query(
      `SELECT id FROM orders WHERE idempotency_key = $1`,
      [idempotencyKey]
    );

    if (existing.rowCount > 0) {
      await client.query("ROLLBACK");
      return { id: existing.rows[0].id, status };
    }

    await client.query(
      `INSERT INTO orders 
       (id, user_id, status, total_amount, currency, idempotency_key)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, userId, status, totalAmount, currency, idempotencyKey]
    );

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
         (id, order_id, product_id, name, price, quantity)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          uuidv4(),
          id,
          item.productId,
          item.name,
          item.price,
          item.quantity
        ]
      );
    }

    await client.query(
      `INSERT INTO outbox_events
       (id, aggregate_id, event_type, payload)
       VALUES ($1,$2,$3,$4)`,
      [
        uuidv4(),
        id,
        "ORDER_CREATED",
        JSON.stringify({ orderId: id })
      ]
    );

    await client.query("COMMIT");

    return { id, status };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { createOrder };
