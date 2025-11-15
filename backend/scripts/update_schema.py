import sqlite3
from pathlib import Path

def update_schema():
    db_path = Path(__file__).parent.parent / 'livemart.db'
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    try:
        # Check if delivery_time column exists
        cursor.execute("PRAGMA table_info(product)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'delivery_time' not in columns:
            print("Adding delivery_time column to product table...")
            cursor.execute("""
                ALTER TABLE product 
                ADD COLUMN delivery_time INTEGER NOT NULL DEFAULT 1
                CHECK (delivery_time >= 1 AND delivery_time <= 7)
            """)
            conn.commit()
            print("Successfully added delivery_time column")
        else:
            print("delivery_time column already exists")
            
        # Verify the update
        cursor.execute("PRAGMA table_info(product)")
        print("\nCurrent product table schema:")
        for column in cursor.fetchall():
            print(f"- {column[1]}: {column[2]}")
            
    except Exception as e:
        print(f"Error updating schema: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    update_schema()
