from prisma import Prisma
import logging

db = Prisma()
logger = logging.getLogger(__name__)

async def connect_db():
    try:
        if not db.is_connected():
            await db.connect()
        print("Connected to database")
    except Exception as e:
        print("Database connection failed:", e)

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
    except Exception:
        # Some engine failures report connected=True while the engine is unusable.
        try:
            await db.disconnect()
        except Exception:
            pass
        await db.connect()
        logger.info("Restarted Prisma query engine connection")
