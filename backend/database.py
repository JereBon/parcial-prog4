from sqlmodel import SQLModel, create_engine, Session
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/parcial_db")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    from .models import Categoria, Producto, Ingrediente, ProductoCategoria, ProductoIngrediente
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
