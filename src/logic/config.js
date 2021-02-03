module.exports = class extends think.Logic {
  indexAction() {
    this.rules = {
      url: {
        required: true
      },
      debug: {
        boolean: true,
        default: false
      }
    };
  }
}