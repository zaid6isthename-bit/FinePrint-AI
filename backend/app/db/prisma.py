from prisma import Prisma
import logging

logger = logging.getLogger(__name__)

db = Prisma(auto_register=True)

async def connect_db():
    try:
        if not db.is_connected():
            await db.connect()
            logger.info("Successfully connected to the PostgreSQL database.")
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")
        # We do not re-raise here to prevent crashing the background initialization task

async def disconnect_db():
    try:
        if db.is_connected():
            await db.disconnect()
            logger.info("Successfully disconnected from the database.")
    except Exception as e:
        logger.error(f"Error disconnecting from database: {e}")
        raise e
