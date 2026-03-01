from prisma import Prisma
import asyncio

db = Prisma()

async def connect_db():
    for _ in range(5):
        try:
            await db.connect()
            print("✅ Connected to DB")
            return
        except Exception as e:
            print("Retrying DB connection...", e)
            await asyncio.sleep(2)

async def disconnect_db():
    if db.is_connected():
        await db.disconnect()
        print("❌ Disconnected DB")