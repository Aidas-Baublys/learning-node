const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pkg = require("./package.json");

const port = process.env.PORT || 5000;
const apiRoot = "/api";
const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: /http:\/\/(127(\.\d){3}|localhost)/ }));
app.options("*", cors());
app.use(apiRoot, router);

let db = {
  Duchas: {
    user: "duchas",
    babkes: "$",
    kiek: "1000",
    apie: "Tipo testas",
    transactions: [],
  },
};

router.get("/", (req, res) => {
  return res.send(`${pkg.description} v${pkg.version}`);
});

router.get("/accounts/:user", (req, res) => {
  const user = req.params.user;
  const account = db[user];

  if (!account) {
    return res.status(404).json({ error: "Nera tokio" });
  }

  return res.json(account);
});

router.post("/accounts", (req, res) => {
  const body = req.body;
  const { user, babkes, kiek, apie, transactions } = body;

  if (!body.user || !body.kiek) {
    res.status(400).json({ error: "Reikia snukio ir babkiu" });
  }

  if (db[body.user]) {
    return res.status(400).json({ error: "Jau yra, nu" });
  }

  if (kiek && isNaN(parseFloat(kiek))) {
    return res.status(400).json({ error: "Turi but skaicius, duche" });
  }

  const account = {
    user,
    babkes,
    kiek: kiek || 0,
    apie,
    transactions,
  };

  db[user] = account;

  return res.status(201).json(account);
});

app.listen(port, () => {
  console.log(`Xujarinam on port ${port}`);
});
