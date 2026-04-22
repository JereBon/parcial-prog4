from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class ProductoCategoria(SQLModel, table=True):
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id", primary_key=True)

class ProductoIngrediente(SQLModel, table=True):
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingrediente.id", primary_key=True)

class CategoriaBase(SQLModel):
    nombre: str = Field(index=True)
    descripcion: Optional[str] = None
    is_active: bool = Field(default=True)

class Categoria(CategoriaBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    productos: List["Producto"] = Relationship(back_populates="categorias", link_model=ProductoCategoria)

class IngredienteBase(SQLModel):
    nombre: str = Field(index=True)
    is_active: bool = Field(default=True)

class Ingrediente(IngredienteBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    productos: List["Producto"] = Relationship(back_populates="ingredientes", link_model=ProductoIngrediente)

class ProductoBase(SQLModel):
    nombre: str = Field(index=True)
    precio: float
    descripcion: Optional[str] = None
    is_active: bool = Field(default=True)

class Producto(ProductoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    categorias: List[Categoria] = Relationship(back_populates="productos", link_model=ProductoCategoria)
    ingredientes: List[Ingrediente] = Relationship(back_populates="productos", link_model=ProductoIngrediente)
