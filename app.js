const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const { Categories, Contents } = require('./models/dbModel')
const { nextTick } = require('process')


const app = express()
const port = process.env.PORT || 3000

const dbURI = "mongodb://testUser:test123@cluster0-shard-00-00.vu7xx.mongodb.net:27017,cluster0-shard-00-01.vu7xx.mongodb.net:27017,cluster0-shard-00-02.vu7xx.mongodb.net:27017/portalDB?ssl=true&replicaSet=atlas-5qniev-shard-0&authSource=admin&retryWrites=true&w=majority"

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => console.log(err))

// middleware
// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/:cat/:subcat', express.static(path.join(__dirname, 'public')))
app.use('/preview/:cat/:subcat/:id', express.static(path.join(__dirname, 'public')))
// app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {

    Categories.find()
        .then(async result => {

            let contents = new Promise(resolve => {
                Contents.find({ catName: result[0].catName, subCatName: result[0].subCategories[0].subCatName })
                    .then(result => {
                        resolve(result)
                    })
                    .catch(err => console.log(err))
            })

            let awaitContents = await contents

            res.render('index', {title: result[0].catName, categories: result, subcategories: result[0], contents: awaitContents, activeCat: result[0].catName, activeSubCat: result[0].subCategories[0].subCatName})
        })
        .catch(err => console.log(err))
})

app.get('/:cat', (req, res) => {
    const cat = req.params.cat

    Categories.find({ catName: cat })
        .then(async result => {
            console.log(result[0].subCategories)

            let categories = new Promise(resolve => {
                Categories.find()
                .then(async result2 => {
                    let contents = new Promise(resolve2 => {
                        Contents.find({ catName:cat, subCatName:result[0].subCategories[0].subCatName })
                            .then(result3 => {
                                resolve2(result3)
                            })
                            .catch(err => console.log(err))
                    })

                    let awaitContents = await contents
                    
                    resolve([result2, awaitContents])
                })
                .catch(err => console.log(err))
            })

            let resRes = await categories

            let activeSubCat = "";

            result.forEach((val, i) => (val.catName === cat) ? activeSubCat = val.subCategories[i].subCatName : activeSubCat = "")

            res.render('index', {title:result[0].catName, categories: resRes[0], subcategories: result[0], contents: resRes[1], activeCat: cat, activeSubCat: activeSubCat})
        })
        .catch(err => console.log(err))
})

app.get('/:cat/:subcat', (req, res) => {
    const cat = req.params.cat
    const subcat = req.params.subcat

    Categories.find({ catName: cat })
        .then(async result => {

            let categories = new Promise(resolve => {
                Categories.find()
                .then(async result2 => {

                    let contents = new Promise(resolve2 => {
                        Contents.find({ catName:cat, subCatName:subcat})
                            .then(result3 => {
                                resolve2(result3)
                            })
                            .catch(err => console.log(err))
                    })

                    let awaitContents = await contents
                    
                    resolve([result2, awaitContents])
                })
                .catch(err => console.log(err))
            })

            let resRes = await categories
            
            res.render('index', {title:subcat, categories: resRes[0], subcategories: result[0], contents: resRes[1], activeCat: cat, activeSubCat: subcat})

        })
        .catch(err => console.log(err))

})

app.get('/preview/:cat/:subcat/:id', (req, res) => {
    const cat = req.params.cat
    const subcat = req.params.subcat
    const id = req.params.id

    Categories.find({ catName: cat })
        .then(async result => {

            let categories = new Promise(resolve => {
                Categories.find()
                .then(async result2 => {

                    let contents = new Promise(resolve2 => {
                        Contents.findById(id)
                            .then(result3 => {
                                resolve2(result3)
                            })
                            .catch(err => console.log(err))
                    })

                    let awaitContents = await contents
                    
                    resolve([result2, awaitContents])
                })
                .catch(err => console.log(err))
            })

            let resRes = await categories
            
            res.render('preview', {title:resRes[1].name, categories: resRes[0], subcategories: result[0], content: resRes[1], activeCat: cat, activeSubCat: subcat})

        })
        .catch(err => console.log(err))
})

app.listen(port, () => console.log('Server Started'))