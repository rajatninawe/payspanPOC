/**
 * PatienntData.js
 *
 * @description :: data requests sent to RedoxEngine
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    body: { type: "json" },
    headers: { type: "json" },
  },

  /**
   *
   *
   *
   * @param values
   * @param cb
   */
  afterCreate: function (values, cb) {
    Patientv2.find({ sort: "id asc" }).exec(function (err, details) {
      if (err) {
        throw err;
      }

      if (details.length < 11) {
        Patientv2.publishCreate(values);
        return cb();
      }

      Patientv2.destroy(details[0].id, function (err) {
        if (err) {
          throw err;
        }

        Patientv2.publishCreate(values);
        cb();
      });
    });
  },
};
