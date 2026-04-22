from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

class CategoriaCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=50)
    descripcion: Optional[str] = Field(None, max_length=200)

class CategoriaRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class IngredienteCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=50)

class IngredienteRead(BaseModel):
    id: int
    nombre: str
    model_config = ConfigDict(from_attributes=True)

class ProductoCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    precio: float = Field(..., gt=0)
    descripcion: Optional[str] = Field(None, max_length=500)
    categorias_ids: List[int] = []
    ingredientes_ids: List[int] = []

class ProductoRead(BaseModel):
    id: int
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categorias: List[CategoriaRead] = []
    ingredientes: List[IngredienteRead] = []
    model_config = ConfigDict(from_attributes=True)
