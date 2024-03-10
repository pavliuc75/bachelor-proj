const moment = require("moment");

export default {
  methods: {
    getDatePartOfDateAsString(date) {
      let result = moment(new Date(date)).format("DD.MM.YYYY");
      return result === "Invalid date" ? "" : result;
    }, getFormattedDateTime(date) {
      let result = moment(new Date(date)).format("DD.MM.YYYY HH:mm");
      return result === "Invalid date" ? "" : result;
    }
  }
};
