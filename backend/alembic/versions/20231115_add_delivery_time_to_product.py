"""Add delivery_time to product

Revision ID: 20231115_add_delivery_time_to_product
Revises: 
Create Date: 2023-11-15 21:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20231115_add_delivery_time_to_product'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add delivery_time column with a default value of 1
    op.add_column('product', sa.Column('delivery_time', sa.Integer(), nullable=False, server_default='1'))
    # Add check constraint to ensure delivery_time is between 1 and 7
    op.create_check_constraint(
        'ck_product_delivery_time_range',
        'product',
        sa.and_(
            sa.column('delivery_time') >= 1,
            sa.column('delivery_time') <= 7
        )
    )

def downgrade() -> None:
    # Remove the check constraint first
    op.drop_constraint('ck_product_delivery_time_range', 'product', type_='check')
    # Then drop the column
    op.drop_column('product', 'delivery_time')
