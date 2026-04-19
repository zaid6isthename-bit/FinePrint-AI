from prisma import Prisma
import logging

db = Prisma()
logger = logging.getLogger(__name__)

async def connect_db():
    try:
        if not db.is_connected():
            await db.connect()
        logger.info("Connected to database")
    except Exception as e:
        logger.error(f"Database connection failed: {repr(e)}")

async def disconnect_db():
    try:
        await db.disconnect()
        print("Disconnected from database")
    except Exception as e:
        print("Error disconnecting:", e)

async def ensure_db_connected():
    try:
        if not db.is_connected():
            await db.connect()
            logger.info("Reconnected Prisma query engine")
            return
            
        # The engine could have been OOM killed by Render. Db.is_connected() might still be True.
        # Run a simple query to verify the engine pipe is actually alive.
        try:
            await db.query_raw("SELECT 1")
        except Exception as query_err:
            logger.warning(f"Prisma engine ping failed ({repr(query_err)}). Restarting connection...")
            try:
                await db.disconnect()
            except Exception:
                pass
            await db.connect()
            logger.info("Restarted Prisma query engine connection successfully")

    except Exception as e:
        logger.error(f"ensure_db_connected failed: {repr(e)}")
