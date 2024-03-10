const moment = require("moment");

function getDatePartOfDateAsString(date: string | Date): string {
  let result = moment(new Date(date)).format("DD.MM.YYYY");
  return result === "Invalid date" ? "" : result;
}

function getFormattedDateTime(date: string | Date): string {
  let result = moment(new Date(date)).format("DD.MM.YYYY HH:mm");
  return result === "Invalid date" ? "" : result;
}

export const dateFormatterHelper = {
  getDatePartOfDateAsString,
  getFormattedDateTime,
};
