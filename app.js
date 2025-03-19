const express = require( 'express' );
const bodyParser = require('body-parser');
const app = express();
const TOKEN = 'ADD_AUTH_TOKEN_HERE';

app.use( bodyParser.json() );


app.use( (req, res, next) => {
    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH' );
    res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type, Authorization' );
    next()
} )

app.post( '/api', ( req, res, next ) => {
    const { method, url } = req.body;
    let status = 200;
    if( method === 'POST' ){
        delete req.body.method;
        delete req.body.url;
        fetch( url, {
            method: 'POST',
            headers: {
                'token': TOKEN,
                'organization': 'BRAMBLES',
                'userId': '4b7b4bb9-8821-423c-92fd-0c77a434c0fe',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( req.body )
        }).then( (response) => {
            status = response.status;
            return response.json()
        } ).then( responseJson => {
            if( status !== 200 ){
                const error = new Error( JSON.stringify(responseJson) );
                error.statusCode = status;
                throw error
            }
            else
                res.status( 200 ).json( responseJson )
        } ).catch( error => {
            next( error )
        } )
    }else if( req.body.method === 'GET' ){
        const queryParamsString = new URLSearchParams( req.body.params );
        const requestUrl = `${ req.body.url }?${ queryParamsString }`
        fetch( requestUrl, {
            method: 'GET',
            headers: {
                'token': TOKEN,
                'organization': 'BRAMBLES',
                'userId': '4b7b4bb9-8821-423c-92fd-0c77a434c0fe',
                'Content-Type': 'application/json'
            },
        }).then( (response) => {
            status = response.status;
            return response.json()
        } ).then( responseJson => {
            if( status !== 200 ){
                const error = new Error( JSON.stringify(responseJson) );
                error.statusCode = status;
                throw error
            }
            else
                res.status( 200 ).json( responseJson )
        } ).catch( error => {
            next( error )
        } )
    }
    
} )

app.use(( error, req, res, next ) => {
    const errorBody = JSON.parse(error.message);
    res.status(error.statusCode || 502).json( errorBody );
})

app.listen( 3000, () => {
    console.log('Listening on 3000')
} )