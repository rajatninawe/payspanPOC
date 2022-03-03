/**
 * PatientController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

const { computeData } = require("./helpers/patientDataCompute");
const siu12Config = require("../../tasks/siu-12.json");

var parser = require("@rimiti/object-hl7-parser");
var json2json = require("awesome-json2json");
const { fhirTemplateObj } = require("./helpers/fhirTemplate");

module.exports = {
  find: function (req, res) {
    Patientv2.subscribe(req.socket);

    Patientv2.find()
      .sort("createdAt desc")
      .exec(function (err, details) {
        if (err) {
          throw err;
          return res.badRequest("Error loading transmissions.");
        }

        res.send(details);
      });
  },

  findOne: function (req, res) {
    var id = req.params.id;

    if (!id) {
      return res.badRequest("No ID found.");
    }

    Patientv2.findOne(id, function (err, details) {
      if (err) {
        throw err;
      }

      if (!details) {
        return res.badRequest("No message found.");
      }

      ///////
      const getSIU12 = parser.getSIU12(details, siu12Config);

      // If you want a stringified output

      console.log("+++++++++++++");

      console.log("getSIU12", getSIU12.getMessage());

      console.log("+++++++++++++");

      //////

      var hconvData = computeData(details);
      console.log("hconvData", hconvData);
      var template = fhirTemplateObj();
      var libCOnv = json2json.default(details && details.body, template);

      //   console.log("libCOnv", libCOnv);
      var model = {
        details: libCOnv,
        json: JSONParser.prettyPrint(details && details.body),
        hl7: getSIU12.getMessage(),
      };

      //   console.log("model", details.body);
      res.view("patientDetailsv2", model);
    });
  },
  computeData: function (details) {
    console.log("details", details);
  },
};
