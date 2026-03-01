from prisma import Prisma
import logging

logger = logging.getLogger(__name__)

db = Prisma(auto_register=True)

from prisma import Prisma
import asyncio

prisma = Prisma()

async def connect_db():
    for _ in range(5):
        try:
            await prisma.connect()
            print("✅ Connected to database")
            return
        except Exception as e:
            print("❌ DB connection failed, retrying...", e)
            await asyncio.sleep(2)

async def disconnect_db():
    try:
        if db.is_connected():
            await db.disconnect()
            logger.info("Successfully disconnected from the database.")
    except Exception as e:
        logger.error(f"Error disconnecting from database: {e}")
        raise e
