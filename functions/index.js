const functions = require('firebase-functions');
const admin = require('firebase-admin');
const superagent = require('superagent')
admin.initializeApp();

const db = admin.firestore();

// Cloud Function to increment a document field after creation. 
exports.keepCount = functions.firestore
    .document('Consignments/{consignmentId}')
    .onCreate((snapshot, context) => {

        // Run inside a transaction
        return db.runTransaction(async transaction => {

            // Get the metadata document and increment the count. 
            const metaRef = db.doc('metadata/consignments');
            const metaData = (await transaction.get(metaRef)).data();

            const consignmentTransactionNumber = metaData.count + 1;

            transaction.update(metaRef, {
                count: consignmentTransactionNumber
            });

            // Update the customer document
            const customerRef = snapshot.ref;

            transaction.update(customerRef, {
                consignmentTransactionNumber,
            });


        });

    });

exports.coop = functions.https.onRequest((req, res) => {




    console.log(req.body.body);
    res.status(200).end()





});


exports.register = functions.https.onRequest((req, res) => {
    // ...


    let consumerkey = 'UayFiWMoROh6SEFstbPNLi8s2w6Nicbm'
    let consumersecret = 'IeLOrjh3h4fwOK4L'
    let token_auth = "Basic " + Buffer.from(consumerkey + ":" + consumersecret).toString("base64");


    superagent.get('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials').set('Authorization', token_auth).set('accept', 'json').then((token_body) => {



        let token = token_body.body.access_token

        console.log(token)

        let register_url = 'https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl'
        let confirmation = 'https://us-central1-adfy-9ee95.cloudfunctions.net/ConfirmationURL?token=Q1K8gJ>2^[1V51P'
        let validationurl = 'https://us-central1-adfy-9ee95.cloudfunctions.net/ValidationURL?token=Q1K8gJ>2^[1V51P'


        let request_data = {
            'ShortCode': 604781,
            'ResponseType': 'Cancelled',
            'ConfirmationURL': confirmation,
            'ValidationURL': validationurl
        };

        let auth = "Bearer " + token;



        // eslint-disable-next-line promise/no-nesting
        return superagent.post(register_url).set('Authorization', auth).send(request_data).set('accept', 'json').then((token_body) => {


            console.log(token_body)

            return true;
        }).catch(error => console.log(error));


    }).catch(error => console.log(error));

    res.status(200).end()
});





























exports.iWantToREceiveMpesaMessageHere = functions.https.onRequest((req, res) => {





    res.status(200).send(req)





});