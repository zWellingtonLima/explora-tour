// Add production routes
const whitelist = ["http://localhost:5173"];
const corsOptions = {
  origin: function (origin: string, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS not Allowed."));
    }
  },
};
export default corsOptions;
