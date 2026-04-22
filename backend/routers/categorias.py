from fastapi import APIRouter, Depends, Query, Path
from sqlmodel import Session
from typing import List, Annotated
from ..database import get_session
from ..schemas import CategoriaRead, CategoriaCreate
from ..services.categoria_service import CategoriaService

router = APIRouter(prefix="/categorias", tags=["Categorias"])

@router.get("/", response_model=List[CategoriaRead])
def read_categorias(
    session: Session = Depends(get_session),
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 100
):
    service = CategoriaService(session)
    return service.get_all(skip=skip, limit=limit)

@router.post("/", response_model=CategoriaRead, status_code=201)
def create_categoria(
    categoria: CategoriaCreate,
    session: Session = Depends(get_session)
):
    service = CategoriaService(session)
    return service.create(categoria)

@router.put("/{categoria_id}", response_model=CategoriaRead)
def update_categoria(
    categoria_id: int,
    categoria: CategoriaCreate,
    session: Session = Depends(get_session)
):
    service = CategoriaService(session)
    return service.update(categoria_id, categoria)

@router.delete("/{categoria_id}", status_code=204)
def delete_categoria(
    categoria_id: Annotated[int, Path(title="The ID of the category to delete")],
    session: Session = Depends(get_session)
):
    service = CategoriaService(session)
    service.delete(categoria_id)
