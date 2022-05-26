const boom = require('@hapi/boom');
const pool = require('../libs/postgres.pool');

class CategoryService {

  constructor(){
    this.pool = pool;
    this.pool.on("error", err => console.error(err));
  }

  async find() {
    const query = "SELECT * FROM CATEGORIES";
    const categories = await this.pool.query(query);
    return categories.rows;
  }

  async findOne(id) {
    const query = "SELECT * FROM CATEGORIES WHERE ID = $1";
    const category = await this.pool.query(query, [id]);
    return category.rows;
  }

  async create(data) {
    let { name, items } = data;
    const queryId = "SELECT (MAX(ID) + 1) AS ID FROM CATEGORIES";
    const { rows } = await this.pool.query(queryId);

    if (!items) {
      items = 0;
    }
    const values = [rows[0].id, name, items];
    const query = "INSERT INTO CATEGORIES (ID, NAME, ITEMS) VALUES ($1, $2, $3)"
    await this.pool.query(query, values);

    return {
      id: rows[0].id,
      ...data
    };
  }

  async update(id, changes) {
    const dataUpdate = [];
    const setQuery = [];

    Object.entries(changes).forEach((entrie, index) => {
      setQuery.push(entrie[0] + `= $${index + 1}`);
      dataUpdate.push(entrie[1]);
    });
    const query = `UPDATE CATEGORIES SET ${setQuery.join(", ")} WHERE ID = ${id}`;
    await this.pool.query(query, dataUpdate);
    return {
      id,
      ...changes,
    };
  }

  async delete(id) {
    const query = "SELECT * FROM CATEGORIES WHERE ID = $1";
    await this.pool.query(query, [id]);
    return { id };
  }

}

module.exports = CategoryService;
