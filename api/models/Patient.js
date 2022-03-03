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
    Patient.find({ sort: "id asc" }).exec(function (err, details) {
      if (err) {
        throw err;
      }

      if (details.length < 11) {
        Patient.publishCreate(values);
        return cb();
      }

      Patient.destroy(details[0].id, function (err) {
        if (err) {
          throw err;
        }

        Patient.publishCreate(values);
        cb();
      });
    });
  },
};
