/**
 * PatientController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  find: function (req, res) {
    Patient.subscribe(req.socket);

    Patient.find()
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

    Patient.findOne(id, function (err, details) {
      if (err) {
        throw err;
      }

      if (!details) {
        return res.badRequest("No message found.");
      }

      var model = {
        details: details && details.body && details.body.Patient,
        json: JSONParser.prettyPrint(
          details && details.body && details.body.Patient
        ),
      };

      //   console.log("model", model);
      res.view("patientDetails", model);
    });
  },
};
