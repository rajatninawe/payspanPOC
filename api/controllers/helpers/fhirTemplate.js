var lodash = require("lodash");
module.exports = {
  fhirTemplateObj: function () {
    let payload = {
      id: { $path: "id", $default: 0 },
      displayName: {
        $path: "name[]",
        $formatting: (barValue, { $item: item }) => {
          //   console.log("barValue", barValue);
          //   console.log("item", item);
          return `${barValue.given} ${barValue.family}`;
        },
        $default: "Unknown",
      },
      gender: {
        $path: "gender",
        $formatting: (barValue, { $item: item }) => {
          return lodash.startCase(barValue);
        },
        $default: "---",
      },
      ssn: {
        $path: "identifier",
        $formatting: (barValue, { $item: item }) => {
          let ssndt = lodash.find(barValue, {
            system: "http://hl7.org/fhir/sid/us-ssn",
          });
          if (ssndt) return ssndt.value;
          else return "---";
        },
        $default: "---",
      },
      dob: { $path: "birthDate", $default: "---" },
      maritalStatus: {
        $path: "maritalStatus",
        $formatting: (barValue, { $item: item }) => {
          return barValue
            ? barValue.text === "M"
              ? "Married"
              : "Unmarried"
            : "---";
        },
        $default: "---",
      },
      address: {
        $path: "address",
        $formatting: (barValue, { $item: item }) => {
          return barValue && barValue[0]
            ? `${barValue[0].line}, ${
                barValue[0].city ? barValue[0].city + "," : ""
              } ${barValue[0].state ? barValue[0].state + ", " : ""} ${
                barValue[0].country ? barValue[0].country + ", " : ""
              } ${barValue[0].postalCode ? barValue[0].postalCode : ""}`
            : "---";
        },
        $default: "---",
      },
      languages: {
        $path: "communication",
        $formatting: (barValue, { $item: item }) => {
          console.log("barValue", barValue);
          return barValue
            ? barValue.map((item) => {
                if (item.language.text) return item.language.text;
                else return item.language.coding[0].display;
              })
            : "---";
        },
        $default: "---",
      },
      contact: {
        $path: "telecom",
        $formatting: (barValue, { $item: item }) => {
          //   console.log("barValue", barValue);
          return barValue
            ? barValue.map((item) => {
                return item.value;
              })
            : "---";
        },
        $default: "---",
      },
      email: {
        $path: "telecom",
        $formatting: (barValue, { $item: item }) => {
          let emdt = lodash.find(barValue, {
            system: "email",
          });
          return emdt ? emdt.value : "---";
        },
        $default: "---",
      },
      MRID: {
        $path: "identifier",
        $formatting: (barValue, { $item: item }) => {
          let mrdt = lodash.find(barValue, {
            type: { text: "Medical Record Number" },
          });
          let mrdtDSTU2 = lodash.find(barValue, {
            type: { coding: [{ code: "MR" }] },
          });

          if (mrdtDSTU2) {
            return mrdtDSTU2.value;
          } else if (mrdt) return mrdt.value;
          else return "---";
        },
        $default: "---",
      },
      lastUpdated: {
        $path: "meta.lastUpdated",
        $formatting: (barValue, { $item: item }) => {
          return barValue ? new Date(barValue) : "---";
        },
        $default: "--",
      },
    };
    return payload;
  },
};
