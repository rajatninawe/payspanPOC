function getAllPatientDatav2() {
  $.ajax({
    type: "GET",
    url: "/patientSearchv2",
    cache: false,
    success: function (response) {
      console.log("response", response);
      var table = $("#patientdata-table").dataTable({
        // lengthChange: false,
        // "dom": '<"top"i>rt<"bottom"flp><"clear">',
        // dom: "Bfrtip",
        // dom: '<"top"Bf>rtip<"bottom"l><"clear">',
        lengthMenu: [
          [5, 10, 25, 50, -1],
          [5, 10, 25, 50, "All"],
        ],
        dom: '<"top"<"left-col"B><"right-col"f>>rtip<"bottom"l><"clear">',
        buttons: ["excel", "pdf", "colvis"],
        destroy: true,
        data: response,
        aoColumns: [
          {
            data: "first_name",
            render: function (data, type, full, meta) {
              let pd = full.body;
              var officialName = _.find(pd.name, { use: "official" });
              if (officialName) {
                return officialName.given[0] + " " + officialName.family;
              } else {
                let name = _.get(pd, "name[0]", "---");
                return name.given + " " + name.family;
              }
            },
          },
          {
            data: "sex",
            render: function (data, type, full, meta) {
              let gender = full.body.gender;
              return _.startCase(gender) || "-";
            },
          },
          {
            data: "dob",
            render: function (data, type, full, meta) {
              let birthDate = full.body.birthDate;
              return birthDate || "-";
            },
          },
          {
            data: "address",
            render: function (data, type, full, meta) {
              let address = full.body.address && full.body.address[0];
              if (address) {
                return `${address.line[0]}, ${
                  address.city ? address.city + "," : ""
                } ${address.state ? address.state + ", " : ""} ${
                  address.country ? address.country + ", " : ""
                } ${address.postalCode ? address.postalCode : ""}`;
              } else {
                return "---";
              }
            },
          },
          {
            data: "ssn",
            render: function (data, type, full, meta) {
              let pd = full.body;
              var ssn = _.find(pd.identifier, {
                system: "http://hl7.org/fhir/sid/us-ssn",
              });
              if (ssn) {
                return ssn.value;
              } else {
                return "--";
              }
            },
          },
          {
            data: "telecom",
            render: function (data, type, full, meta) {
              let telecom = full.body.telecom && full.body.telecom[0];

              if (telecom) {
                return telecom.value;
              } else {
                return "--";
              }
            },
          },
          {
            data: "ssn",
            render: function (data, type, full, meta) {
              return `<div style="cursor:pointer"><a href="/patientDetailsv2/${full.id}" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 2rem; color: cornflowerblue;"></i></a></div>`;
            },
          },
        ],
      });
      //   table
      //     .buttons()
      //     .container()
      //     .appendTo("#patientdata-table_wrapper .col-md-6:eq(0)");
    },
    error: function (jqXhr, textStatus, errorMessage) {
      console.log("errorMessage", errorMessage);
    },
  });
}
