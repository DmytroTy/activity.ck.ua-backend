/* eslint-disable no-underscore-dangle */
const { checkError } = require('../checkError');
const log = require('../../utils/logger')(__filename);

module.exports = (client) => {
  return {
    createReview: async ({ place_id: placeId, user_id: userId, rating, comment }) => {
      try {
        if (!userId) {
          throw new Error('ERROR: No user_id defined');
        }

        const res = await client.query(
          `INSERT INTO reviews (place_id, user_id, rating, comment)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`,
          [placeId, userId, rating, comment],
        );

        log.debug(res.rows[0], 'New review created:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    getReviews: async (placeId, limit, page) => {
      try {
        if (!placeId) throw new Error('ERROR: No placeId defined');

        const {
          rows: [{ count }],
        } = await client.query(
          `SELECT COUNT(*)
            FROM reviews
            WHERE place_id =$1;`,
          [placeId],
        );
        const total = Number(count);

        const offset = (page - 1) * limit;
        const { rows: reviews } = await client.query(
          `SELECT user_id, rating, comment, created_at
            FROM reviews
            WHERE place_id =$1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;`,
          [placeId, limit, offset],
        );

        const res = {};
        res.reviews = reviews;
        res._total = total;
        res._totalPages = Math.ceil(total / limit);

        return res;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    updateReview: async ({ id, ...review }) => {
      try {
        if (!id) {
          throw new Error('ERROR: No review id defined');
        }

        if (!Object.keys(review).length) {
          throw new Error('ERROR: Nothing to update');
        }

        const query = [];
        const values = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [i, [k, v]] of Object.entries(review).entries()) {
          query.push(`${k} = $${i + 1}`);
          values.push(v);
        }

        values.push(id);

        const res = await client.query(
          `UPDATE reviews SET ${query.join(', ')}
            WHERE id = $${values.length}
            RETURNING place_id, user_id, rating, comment, created_at;`,
          values,
        );

        log.debug(res.rows[0], 'Review updated:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    deleteReview: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No review id defined');
        }

        await client.query('DELETE FROM reviews WHERE id = $1;', [id]);

        return true;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },
  };
};
