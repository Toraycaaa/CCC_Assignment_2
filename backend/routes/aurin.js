var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("api for aurin");
});
// router for labour market output
router.get("/labour/info", (req, res) => {
  var labour_data = require("../aurin/labour_market/output.json");
  const query_info = req.query;

  let isSummary = false;
  isSummary = query_info.summary == "true";

  if (query_info.city) {
    const city = query_info.city;
    res.json(filterForLabour(city, isSummary));
  } else {
    res.json(labour_data);
  }

  function filterForLabour(city, isSummary) {
    if (isSummary) {
      return labour_data[city].summary;
    } else {
      return labour_data[city].details;
    }
  }
});

// router for labour summary output
router.get("/labour_summary/info", (req, res) => {
  var labour_summary_data = require("../aurin/labour_summary/output_sa4.json");
  const query_info = req.query;

  if (query_info.sa4) {
    const sa4 = query_info.sa4;

    // transferToNum = Object.keys(labour_summary_data[sa4]).reduce((newData, key) =>{
    //   newData[key] = parseFloat(labour_summary_data[sa4][key]);
    //   return newData
    // }, {})

    res.json(labour_summary_data[sa4]);
  } else {
    res.json(labour_summary_data);
  }
});

// router for migration output
router.get("/migration/info", (req, res) => {
  var migration_data = require("../aurin/migration/output.json");
  const query_info = req.query;

  if (query_info.city) {
    const city = query_info.city;
    res.json(migration_data[city]);
  } else {
    res.json(migration_data);
  }
});

// router for payroll output
router.get("/payroll/info", (req, res) => {
  var payroll_data = require("../aurin/weekly_payroll/output.json");
  const query_info = req.query;

  if (query_info.state) {
    const state = query_info.state;
    if (query_info.suburb) {
      const suburb = query_info.suburb;
      if (query_info.month) {
        const month = query_info.month;
        res.json(payroll_data[state][suburb][month]);
      } else {
        res.json(payroll_data[state][suburb]);
      }
    } else {
      res.json(payroll_data[state]);
    }
  } else {
    res.json(payroll_data);
  }
});

// router for projection employment output
router.get("/projection/info", (req, res) => {
  var projection_data = require("../aurin/projection_employment/output.json");
  const query_info = req.query;
  if (query_info.city) {
    const city = query_info.city;
    redundant = projection_data[city];
    simple = Object.keys(redundant).reduce((newData, key) => {
      let newKey = key.substring(53);
      newData[newKey] = redundant[key];
      return newData;
    }, {});

    industries = {};

    for (var key in simple) {
      pos = key.indexOf(" ");
      if (!Object.keys(industries).includes(key.substring(pos + 1))) {
        newKey = key.substring(pos + 1);
        industries[newKey] = { abs: 0, percentage: 0 };
      }

      if (key.substring(0, pos).includes("0")) {
        industries[key.substring(pos + 1)]["abs"] = simple[key];
      } else {
        industries[key.substring(pos + 1)]["percentage"] = simple[key];
      }

      // console.log(industries)
    }

    let list = [];
    for (let key in industries) {
      let item = {
        abs: industries[key].abs,
        percentage: industries[key].percentage,
        name: key,
      };
      list.push(item);
    }
    console.log(list);
    res.json(list);

    // res.json(industries);
  } else {
    res.json(projection_data);
  }
});

module.exports = router;
