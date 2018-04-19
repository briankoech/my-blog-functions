import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

const app = express();
app.use(cors({ origin: true }));
const firebaseAdmin = admin.initializeApp(functions.config().firebase);

const controller = async (req, res) => {
  const token = req.headers['x-access-token'] || req.query['x-access-token'];
  console.log(token);

  if (!token) return res.status(401).send({ message: 'No token provided' });
  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    console.log(decoded);
    return res.status(200).send(decoded);
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: 'Provided token is invalid' });
  }
};

app.get('', controller);
export const Auth = functions.https.onRequest(app);

