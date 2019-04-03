// const MongoClient = require('mongodb').MongoClient;
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const { MONGO_USER, MONGO_PASS, MONGO_URL, MONGO_DB, MONGO_COLL } = process.env;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_URL}`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db(MONGO_DB).collection(MONGO_COLL);
  collection.insertMany([{
    "id": 7,
    "ratingId": 109762895,
    "rymId": 273179,
    "artist": "Ryuichi Sakamoto",
    "album": "Esperanto",
    "year": 1985,
    "genres": [
      "Progressive Electronic",
      "Tribal Ambient"
    ],
    "rating": 8,
    "dateAdded": {
      "month": "Feb",
      "day": "25",
      "year": "2019"
    }
  },
  {
    "id": 8,
    "ratingId": 109429554,
    "rymId": 147973,
    "artist": "Nuno Canavarro",
    "album": "Plux Quba",
    "year": 1988,
    "genres": [
      "Tape Music",
      "Electroacoustic"
    ],
    "rating": 7,
    "dateAdded": {
      "month": "Feb",
      "day": "17",
      "year": "2019"
    }
  }
  ], (err, result) => {
    console.log(result)
    client.close();
  })
});