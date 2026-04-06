"""add_warning_field_to_beaches

Revision ID: a1b2c3d4e5f6
Revises: 29caa8a7872a
Create Date: 2026-04-06 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '29caa8a7872a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Adiciona coluna warning para alertas especiais de segurança."""
    op.add_column('beaches', sa.Column('warning', sa.Text(), nullable=True))


def downgrade() -> None:
    """Remove coluna warning."""
    op.drop_column('beaches', 'warning')
