const functions = require('firebase-functions');
const admin = require('firebase-admin');
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