import morgan from 'morgan';

// Custom format for better visibility
const logger = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => {
      console.log(`[LOG] ${message.trim()}`);
    }
  }
});

export default logger;
