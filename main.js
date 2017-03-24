var document_model_id = '1_uh2Ro2plc8V-Wsg-xaNYM9x6Vtc8bJgN5G3eIQ_tRA';

//folder where the confirmation files will be saved.
var folder_id = '0B3E6BV82jlToc1huOFR5aUpwOGc';

//https://developers.google.com/apps-script/articles/sending_emails
function sendEmails(emailAddress, file, name, key) {
    if (emailAddress !== '') {

        var subject = "[" + key + "] Application - 20XX";
        var message = "Hello," + name + "! <br /> Thanks for your application. <br /> Receipt is attached to this email. <br /> Regards!";

        MailApp.sendEmail({
            to: emailAddress,
            subject: subject,
            htmlBody: message,
            attachments: [file.getAs(MimeType.PDF)]
        });
    }
}

//https://developers.google.com/apps-script/guides/triggers/events#form-submit
function onFormSubmit(e) {

    //generate a simple key but could also be a random function
    var key = nome.substring(0, 3) + rg.substring(0, 2),
        copyFile = DriveApp.getFileById(document_model_id).makeCopy('Copy name - ' + name),
        copyId = copyFile.getId(),
        copyDoc = DocumentApp.openById(copyId),
        copyBody = copyDoc.getBody(),
        pdfFile,
        name = e.values[0],
        emailAddress = e.values[1],
        id = e.values[2];

    copyBody.replaceText('%KEY%', key);
    copyBody.replaceText('%NOME%', name);

    copyDoc.saveAndClose();
    pdfFile = DriveApp.getFolderById(folder_id).createFile(copyFile.getAs("application/pdf"));

    copyFile.setTrashed(true);

    sendEmails(emailAddress, pdfFile, nome, key);
}



//http://stackoverflow.com/questions/12372959/is-there-any-way-to-debug-a-spreadsheet-app-script-at-runtime
function test_onFormSubmit() {
    var dataRange = SpreadsheetApp.getActiveSheet().getDataRange();
    var data = dataRange.getValues();
    var headers = data[0];
    // Start at row 1, skipping headers in row 0
    for (var row = 2; row < data.length; row++) {
        var e = {};
        e.values = data[row];
        e.range = dataRange.offset(row, 0, 1, data[0].length);
        e.namedValues = {};
        // Loop through headers to create namedValues object
        for (var col = 0; col < headers.length; col++) {
            e.namedValues[headers[col]] = e.values[col];
        }
        // Pass the simulated event to onFormSubmit
        onFormSubmit(e);
    }
}