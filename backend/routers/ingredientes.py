from fastapi import APIRouter, Depends, Query, Path
from sqlmodel import Session
from typing import List, Annotated
from ..database import get_session
from ..schemas import IngredienteRead, IngredienteCreate
from ..services.ingrediente_service import IngredienteService

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

@router.get("/", response_model=List[IngredienteRead])
def read_ingredientes(
    session: Session = Depends(get_session),
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 100
):
    service = IngredienteService(session)
    return service.get_all(skip=skip, limit=limit)

@router.post("/", response_model=IngredienteRead, status_code=201)
def create_ingrediente(
    ingrediente: IngredienteCreate,
    session: Session = Depends(get_session)
):
    service = IngredienteService(session)
    return service.create(ingrediente)

@router.put("/{ingrediente_id}", response_model=IngredienteRead)
def update_ingrediente(
    ingrediente_id: int,
    ingrediente: IngredienteCreate,
    session: Session = Depends(get_session)
):
    service = IngredienteService(session)
    return service.update(ingrediente_id, ingrediente)

@router.delete("/{ingrediente_id}", status_code=204)
def delete_ingrediente(
    ingrediente_id: Annotated[int, Path(title="The ID of the ingrediente to delete")],
    session: Session = Depends(get_session)
):
    service = IngredienteService(session)
    service.delete(ingrediente_id)
