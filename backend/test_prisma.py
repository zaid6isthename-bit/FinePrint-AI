import asyncio
from prisma import Prisma

async def main():
    try:
        db = Prisma()
        print("Connecting...")
        await db.connect()
        print("Connected:", db.is_connected())
        
        print("Fetching users...")
        users = await db.user.find_many()
        print(f"Users found: {len(users)}")
        
        await db.disconnect()
        print("Disconnected.")
    except Exception as e:
        print(f"Error: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
