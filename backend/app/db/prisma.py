from prisma import Prisma
import asyncio

db = Prisma()

async def connect_db():
    try:
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