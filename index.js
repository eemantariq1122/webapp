// Import required modules
const admin = require('firebase-admin');
const WebSocket = require('ws');

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require('./firebasekey/fbkey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://march-79c99-default-rtdb.asia-southeast1.firebasedatabase.app'
});

// Get a reference to the 'Sensor' node in the Firebase database
const db = admin.database();
const sensorRef = db.ref('Sensor');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Function to send data to connected clients
function sendDataToClients(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
// Listen for changes in the Firebase database
sensorRef.on('value', snapshot => {
    const data = snapshot.val();
    console.log('Sending data to clients:', data); // Log the data before sending
    sendDataToClients(data); // Send data to connected clients when there's a change
}, errorObject => {
    console.error('The read failed: ' + errorObject.code);
});