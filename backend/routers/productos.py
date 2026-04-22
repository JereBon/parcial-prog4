from fastapi import APIRouter, Depends, Query, Path
from sqlmodel import Session
from typing import List, Annotated
from ..database import get_session
from ..schemas import ProductoRead, ProductoCreate
from ..services.producto_service import ProductoService

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/", response_model=List[ProductoRead])
def read_productos(
    session: Session = Depends(get_session),
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 100
):
    service = ProductoService(session)
    return service.get_all(skip=skip, limit=limit)

@router.post("/", response_model=ProductoRead, status_code=201)
def create_producto(
    producto: ProductoCreate,
    session: Session = Depends(get_session)
):
    service = ProductoService(session)
    return service.create(producto)

@router.put("/{producto_id}", response_model=ProductoRead)
def update_producto(
    producto_id: int,
    producto: ProductoCreate,
    session: Session = Depends(get_session)
):
    service = ProductoService(session)
    return service.update(producto_id, producto)

@router.delete("/{producto_id}", status_code=204)
def delete_producto(
    producto_id: Annotated[int, Path(title="The ID of the producto to delete")],
    session: Session = Depends(get_session)
):
    service = ProductoService(session)
    service.delete(producto_id)
