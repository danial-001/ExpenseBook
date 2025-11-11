"""
Database initialization script
Run this script to create all database tables
"""
import sys
import os

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from models import db

def init_database():
    """Initialize the database and create all tables"""
    app = create_app()
    
    with app.app_context():
        # Drop all existing tables (use with caution in production!)
        # db.drop_all()
        # print("Dropped all existing tables")
        
        # Create all tables
        db.create_all()
        print("✓ Database tables created successfully!")
        print("\nTables created:")
        print("  - users")
        print("  - expenses")
        print("  - incomes")
        print("  - savings_transactions")

if __name__ == '__main__':
    init_database()
