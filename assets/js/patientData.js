function getAllPatientData() {
  $.ajax({
    type: "GET",
    url: "/patientSearch",
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
              return full.body.Patient.Identifiers[1].ID;
            },
          },
          {
            data: "first_name",
            render: function (data, type, full, meta) {
              let patientDemographics = full.body.Patient.Demographics;
              return (
                patientDemographics.LastName +
                " " +
                patientDemographics.FirstName +
                " " +
                patientDemographics.MiddleName
              );
            },
          },
          {
            data: "sex",
            render: function (data, type, full, meta) {
              let patientDemographics = full.body.Patient.Demographics;
              return patientDemographics.Sex;
            },
          },
          {
            data: "dob",
            render: function (data, type, full, meta) {
              let patientDemographics = full.body.Patient.Demographics;
              return patientDemographics.DOB;
            },
          },
          {
            data: "address",
            render: function (data, type, full, meta) {
              let address = full.body.Patient.Demographics.Address;
              return (
                address.StreetAddress +
                ", " +
                address.City +
                ", " +
                address.County +
                ", " +
                address.State +
                ", " +
                address.Country +
                ", " +
                address.ZIP
              );
            },
          },
          {
            data: "ssn",
            render: function (data, type, full, meta) {
              let patientDemographics = full.body.Patient.Demographics;
              return patientDemographics.SSN;
            },
          },
          {
            data: "pcp",
            render: function (data, type, full, meta) {
              let pcpData = full.body.Patient.PCP;
              return (
                pcpData.Credentials[0] +
                " " +
                pcpData.LastName +
                " " +
                pcpData.FirstName +
                " - " +
                pcpData.NPI
              );
            },
          },
          {
            data: "ssn",
            render: function (data, type, full, meta) {
              let patientDemographics = full.body.Patient.Demographics;
              return `<div style="cursor:pointer"><a href="/patientDetails/${full.id}" target="_blank"><i class="bi bi-box-arrow-up-right" style="font-size: 2rem; color: cornflowerblue;"></i></a></div>`;
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
