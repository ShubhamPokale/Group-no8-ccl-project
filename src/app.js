const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const port = process.env.PORT || 3000

//define paths for express config
const publicDirectoryPath =  path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')


//set up hbs engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


//set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
     res.render('index',{
         title: 'Weather app',
         name:'Shubham Pokale , Prathamesh Ahir , Furquan Thokan , Kaushal Sawant '
     })
})

app.get('/about', (req,res) => {
    res.render('about',{
        title:'About',
        name:'Shubham Pokale , Prathamesh Ahir , Furquan Thokan , Kaushal Sawant'
    })
})

app.get('/help', (req,res) => {
    res.render('help',{
        title:'Help',
        email:'shubham.pokale2001@gmail.com',
        name: 'Shubham Pokale , Prathamesh Ahir , Furquan Thokan , Kaushal Sawant'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'you must provide an address'
        })
    }
    
    geocode(req.query.address,(error,data) => {
        if(error){
          return res.send({error})
        }
        
        forecast(data.latitude,data.longitude,(error,forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                location: data.location,
                forecast: forecastData,
                address:req.query.address   
            })
        })

    })


    // res.send({
    //     forecast: 'it is raining',
    //     location:'Thane',
    //     address: req.query.address
    // })
})

app.get('/help/*', (req,res) => {
    res.render('404',{
        title:'Error 404',
        errormessage:'Help article not found',
        name: 'Shubham Pokale , Prathamesh Ahir , Furquan Thokan , Kaushal Sawant'
    })
})

app.get('*', (req,res) => {
    res.render('404',{
        title:'Error 404',
        errormessage:'Page not found',
        name: 'Shubham Pokale , Prathamesh Ahir , Furquan Thokan , Kaushal Sawant'
    })
})

app.listen(port, () => {
    console.log(`Server is running at port ${port} `)
})