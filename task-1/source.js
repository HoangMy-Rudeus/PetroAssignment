function importCsvData(
  allImportData,
  normalApiName,
  apiName,
  modal,
  tableName
) {
  var data = [];
  var length = allImportData.length;
  var lengthShown = 0;
  for (var i = 0; i < length; i++) {
    var item = allImportData[i];
    var row = {};
    for (var key in item) {
      if (item.hasOwnProperty(key)) {
        row[key] = item[key];
      }
    }
    data.push(row);
    lengthShown++;
    if (lengthShown % 100 === 0) {
      importRowDataShow(length, lengthShown);
    }
  }
  $.ajax({
    url: normalApiName,
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (result) {
      if (result.success) {
        $(modal).modal("hide");
        $(tableName).DataTable().ajax.reload();
        abp.notify.success("Import completed successfully");
      } else {
        abp.notify.error("Import failed: " + result.error);
      }
    },
    error: function (xhr, status, error) {
      abp.notify.error("Import failed: " + error);
    },
  });
}
