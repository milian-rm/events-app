import mongoose from 'mongoose';

export const dbConnection = async () => {
  try {
    mongoose.connection.on('error', () => {
      console.log('MongoDB | no se pudo conectar a mongoDB');
      mongoose.disconnect();
    });
    mongoose.connection.on('connected', () => {
      console.log('MongoDB | conectado a mongoDB (events)');
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB | desconectado de mongoDB');
    });

    await mongoose.connect(process.env.URI_MONGODB, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
  } catch (error) {
    console.log(`Error al conectar la db: ${error}`);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`MongoDB | Recibida ${signal}. Cerrando conexión...`);
  try {
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('MongoDB | Error en el cierre:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));