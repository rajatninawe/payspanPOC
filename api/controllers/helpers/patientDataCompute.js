var lodash = require("lodash");
module.exports = {
  computeData: function (data) {
    let pd = data.body;
    // console.log("pd", pd);
    var id = lodash.get(pd, "id", "---");
    var officialName = lodash.find(pd.name, { use: "official" });
    let nameString = "---";
    if (lodash.isEmpty(officialName)) {
      let tmpname = lodash.get(pd, "name[0]", "---");
      nameString = tmpname.given + " " + tmpname.family;
    } else {
      nameString = `${officialName.given[0]} ${officialName.family}`;
    }

    let gender = lodash.get(pd, "gender", "---");
    let dob = lodash.get(pd, "birthDate", "---");
    let maritalStatus = lodash.get(pd, "maritalStatus", []);
    console.log("maritalStatus", maritalStatus);
    var ssn = lodash.find(pd.identifier, {
      system: "http://hl7.org/fhir/sid/us-ssn",
    });
    console.log("ssn", ssn);
    let address = lodash.get(pd, "address[0]", []);
    let languagesmeta = pd.communication;
    let languages = [];

    if (!lodash.isEmpty(languagesmeta)) {
      languages = languagesmeta.map((item) => {
        return item.language.text;
      });
    }

    let telecom = pd.telecom && pd.telecom[0];
    let email = lodash.find(pd.telecom, {
      system: "email",
    });

    let MRID = lodash.find(pd.identifier, {
      type: { text: "Medical Record Number" },
    });
    // console.log("MRID", MRID);
    let lastUpdated = lodash.get(pd, "meta.lastUpdated", "---");

    var payload = {
      id: id,
      displayName: nameString,
      ssn: !lodash.isEmpty(ssn) ? ssn.value : "---",
      gender: lodash.startCase(gender),
      dob: dob,
      maritalStatus: !lodash.isEmpty(maritalStatus)
        ? maritalStatus.text === "M"
          ? "Married"
          : "Unmarried"
        : "---",
      address: !lodash.isEmpty(address)
        ? `${address.line[0]}, ${address.city ? address.city + "," : ""} ${
            address.state ? address.state + ", " : ""
          } ${address.country ? address.country + ", " : ""} ${
            address.postalCode ? address.postalCode : ""
          }`
        : "---",
      languages: !lodash.isEmpty(languages) ? languages : "--",
      contact: !lodash.isEmpty(telecom) ? telecom.value : "--",
      email: !lodash.isEmpty(email) ? email.value : "--",
      MRID: !lodash.isEmpty(MRID) ? MRID.value : "--",
      lastUpdated: new Date(lastUpdated),
    };

    // console.log("payload", payload);

    return payload;
  },
};
