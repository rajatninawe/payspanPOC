(function () {
  $.ajax({
    url: "/msgdata",
    type: "GET",
    dataType: "json",
  })
    .done(function (res) {
      console.log("resepdata", res);
      if (res) {
        //   log("Received a message!: ", res);

        // Once we have established the server connection, initialize our table.
        var table = $(".messagedata-table");
        var html, message;

        if (!table) {
          return;
        }

        for (var i in res) {
          message = res[i];
          console.log("i", i);
          console.log("res", res);
          console.log("message", message);
          html = htmlRow(message);
          table.find("tbody").append(html);
        }
      }

      var table = $("#messagedata-table").DataTable({
        // lengthChange: false,
        dom: '<"top"<"left-col"B><"right-col"f>>rtip<"bottom"l><"clear">',
        buttons: ["excel", "pdf", "colvis"],
      });

      // table
      //   .buttons()
      //   .container()
      //   .appendTo("#messagedata-table_wrapper .col-md-6:eq(0)");
    })
    .error(function (err) {
      console.log("resepdataerr", err);
      var table = $("#messagedata-table").DataTable({
        dom: '<"top"<"left-col"B><"right-col"f>>rtip<"bottom"l><"clear">',
        buttons: ["copy", "excel", "pdf"],
      });
    });

  /**
   * A simple log function
   */
  function log() {
    if (typeof console !== "undefined") {
      console.log.apply(console, arguments);
    }
  }

  /**
   * Add a new row to the table with the details of the message
   */
  function htmlRow(message) {
    var html;
    html = "<tr>";
    html +=
      '<td><a href="/message/' +
      message.body.Meta.Message.ID +
      '">' +
      message.body.Meta.Message.ID +
      "</a></td>";
    html += "<td>" + message.body.Meta.DataModel + "</td>";
    html += "<td>" + message.body.Meta.Source.ID + "</td>";
    html += "<td>" + message.body.Meta.Destinations + "</td>";
    html += "<td>" + new Date(message.createdAt) + "</td>";
    html += "<td>" + new Date(message.updatedAt) + "</td>";
    html += "</tr>";

    return html;
  }
})();
