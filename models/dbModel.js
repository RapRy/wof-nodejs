const mongoose = require('mongoose')
const { Schema, model } = mongoose

const subCatSchema = new Schema({
    parent_id: String,
    subCatName: String
})

const catSchema = new Schema({
    catName: String,
    catIcon: String,
    catExt: String,
    subCategories: [subCatSchema]
})

const contentSchema = new Schema({
    name:String,
    catName:String,
    subCatName:String,
    description:String,
    thumbnail:String,
    filename:String,
    screenshots:Array,
    preview:String
})

const Categories = model('category', catSchema)
const Contents = model('content', contentSchema)
module.exports = {
    Categories,
    Contents
}