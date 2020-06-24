const db = require("../config")

function find() {
    return db("schemes")
}

async function findById(id) {
    const scheme = await db("schemes").where("id", id)
    if (scheme.length === 1) {
        return scheme[0]
    } else {
        return null
    }
}

function findSteps(id) {
    return db("steps as st")
        .innerJoin("schemes as sc", "sc.id", "st.scheme_id")
        .where("sc.id", id)
        .select("st.id", "sc.scheme_name", "st.step_number", "st.instructions")
        .orderBy("st.step_number")
}

async function add(scheme) {
    const [newSchemeId] = await db.insert(scheme).into("schemes")
    const newScheme = await db.first("*").from("schemes").where("id", newSchemeId)
    return newScheme
}

async function update(changes, id) {
    await db("schemes").update(changes).where("id", id)
    return await db.first("*").from("schemes").where("id", id)
}

async function remove(id) {
    const deletedScheme = await db.first("*").from("schemes").where("id", id)
    if (deletedScheme) {
        await db("schemes").where("id", id).del()
        return deletedScheme
    } else {
        return null
    }

}

module.exports = {
    find,
    findById,
    findSteps,
    add,
    update,
    remove
}
