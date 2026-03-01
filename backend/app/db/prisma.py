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
    if prisma.is_connected():
        await prisma.disconnect()
        print("Disconnected from database")