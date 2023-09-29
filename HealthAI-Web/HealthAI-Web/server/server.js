const express = require('express');
const cors = require('cors');
const { db } = require('./firebase'); 
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
    try {
        let response = [];

        await db.collection("Users").get().then(querysnapshot => {
            let docs = querysnapshot.docs;

            for (let doc of docs) {
                response.push(doc.data());
            }

            return res.status(200).send(response);
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("Server started on port", port);
});
