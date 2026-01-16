const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.logReward = functions.https.onCall(async (data, context) => {
    
    console.log('logReward called with:', data);
    console.log('Context IP:', context.rawRequest?.ip);
    
    // Validate required fields
    if (!data.follows || !data.signalId) {
        /*throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing required fields: signalId, follows'
        );*/
    }
    
    try {
        await db.collection('rewards').add({
            signalId: data.signalId || 'unknown',
            follows: data.follows || false,
            ip: context.rawRequest?.ip || 'unknown'
        });
        
        console.log('Successfully logged reward');
        return { success: true, logged: true };
        
    } catch (error) {
        console.error('Firestore error:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Failed to log reward: ' + error.message
        );
    }
});


/*
exports.generateSignals = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async (context) => {
    // 1. Fetch price data (CoinGecko API)
    // 2. Calculate indicators
    // 3. Generate signal if conditions met
    // 4. Save to Firestore
  });*/