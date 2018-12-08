// handle repetitious events gracefully
module.exports = {
  errorHandler: (error, res) => {
    let message = error.message || error
    if (error.status) {
      res.statusCode = error.status
    }
    if (res.statusCode < 400) {
      res.statusCode = 400
    }
    if (message === 'Validation error') {
      try {
        let newMessage = ''

        if (error.errors) {
          error.errors.forEach(el => {
            if (newMessage) newMessage += ', '
            newMessage += el.message
          })
        } else if (error.body.errors) {
          error.body.errors.forEach(el => {
            if (newMessage) newMessage += ', '
            newMessage += el.message
          })
        }
        message = newMessage || message
      } catch(e) {
        console.log(e);
      }
    }
    return res.json({
      status: false,
      message,
      error: error.message,
      errorStatus: error.status,
      stack: error.stack,
      body: error
    })
  }
}
