const express = require( 'express' );
const bodyParser = require('body-parser');
const app = express();
const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiJ9.ewogICJ1c2VySWQiIDogIjY4NzQxYjYzLWRkMmQtNGU2Zi1hMGU1LTUwNWQzOGM5MGM3OCIsCiAgInVtYnJlbGxhVXNlcklkIiA6ICJmMjZmZThlYy0yOWIxLTYzMzAtOWIzMC04OWRiNGI0NDljODUiLAogICJ1c2VybmFtZSIgOiAiamFjb2J0b255QGJ4YmQiLAogICJvcmdhbml6YXRpb24iIDogIkJYQkQiLAogICJpc3N1ZWRBdCIgOiAxNzQyMTkyOTI3MTIwLAogICJhY2NvdW50IiA6ICJCWEJEIgp9.AJpAVcb5yTHd0AayCzAxkgISAY-Y2pr9V3C1Yspe4CyRBsDnNBA6bEn7BjxGG_ZSMIx3bllbvRSiI81VLc37vjV5AAuq6smGQbM6X8UkGhCxhLfRgSnelgKkRxKyYxIzUvwM2f0IrnWuIjNC9KR3uL5wTehm6mTRqwPgFaMULFw1N5-V';
const httpHeaders = {
    'token': TOKEN,
    'organization': 'BRAMBLES',
    'userId': '4b7b4bb9-8821-423c-92fd-0c77a434c0fe',
    'Content-Type': 'application/json'
};
app.use( bodyParser.json() );

app.use( (req, res, next) => {
    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH' );
    res.setHeader( 'Access-Control-Allow-Headers', 'Content-Type, Authorization' );
    next()
} )

app.post( '/api', ( req, res, next ) => {
    const { method, url, ...requestBody } = req.body;
    let status = 200;
    switch( method.toLowerCase() ){
        case 'post':
            fetch( url, {
                method,
                headers: httpHeaders,
                body: JSON.stringify( requestBody )
            } ).then( response => {
                return Promise.all([ response.status, response.json() ])
            } ).then( ( response ) => handleResponseJson(response, res) );
            break;
        case 'get':
            fetch( url, {
                method,
                headers: httpHeaders
            } ).then( response => {
                return Promise.all([ response.status, response.json() ])
            } ).then( ( response ) => handleResponseJson(response, res) );
    }
    
} )

app.listen( 3000, () => {
    console.log('Listening on 3000')
} )

function handleResponseJson( [ status, responseJson ], res ){
    console.log( status );
    if( status !== 200 ){
        const errorBody = responseJson;
        res.status(status || 502).json( errorBody );
    }
    else
        res.status( 200 ).json( responseJson )
}