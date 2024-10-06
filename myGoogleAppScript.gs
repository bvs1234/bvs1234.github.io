function doGet(e) {
  const sheet = SpreadsheetApp.openById('19g9x2OJvtJiKwc9-4pZ8RRRGeY7gakiSFuRcjc1sLw4').getSheetByName('Hostel Data');
  const data = sheet.getDataRange().getValues();
  
  // Get the list of unique cities
  if (e.parameter.getCities) {
    const cities = [...new Set(data.slice(1).map(row => row[3]).filter(city => city))]; // Remove empty city names
    return ContentService.createTextOutput(JSON.stringify({ cities })).setMimeType(ContentService.MimeType.JSON);
  }

  // Filter data based on selected city and paginate
  const city = e.parameter.city || '';
  const page = parseInt(e.parameter.page, 10) || 1;
  const rowsPerPage = 100;  // You want 100 rows per page
  let filteredData = data.slice(1); // Skip the header row

  if (city) {
    filteredData = filteredData.filter(row => row[3] === city);
  }

  const total = filteredData.length;
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Format the data for output
  const output = paginatedData.map(row => ({
    hostelName: row[0],
    phoneNumber: row[1],
    area: row[2],
    cityName: row[3]
  }));

  return ContentService.createTextOutput(JSON.stringify({ data: output, total })).setMimeType(ContentService.MimeType.JSON);
}
