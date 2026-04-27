from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from ..models import (
    Producto,
    Categoria,
    Ingrediente,
    ProductoCategoria,
    ProductoIngrediente,
)
from ..schemas import ProductoCreate


class ProductoService:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self, skip: int = 0, limit: int = 100):
        query = (
            select(Producto)
            .where(Producto.is_active == True)
            .options(
                selectinload(Producto.categorias), selectinload(Producto.ingredientes)
            )
            .offset(skip)
            .limit(limit)
        )
        return self.session.exec(query).unique().all()

    def get_by_id(self, producto_id: int):
        query = (
            select(Producto)
            .where(Producto.id == producto_id)
            .where(Producto.is_active == True)
            .options(
                selectinload(Producto.categorias), selectinload(Producto.ingredientes)
            )
        )
        producto = self.session.exec(query).unique().first()
        if not producto:
            raise HTTPException(status_code=404, detail="Producto not found")
        return producto

    def create(self, producto_in: ProductoCreate):
        producto = Producto(
            nombre=producto_in.nombre,
            precio=producto_in.precio,
            descripcion=producto_in.descripcion,
        )
        self.session.add(producto)
        self.session.flush()

        for cat_id in producto_in.categorias_ids:
            cat = self.session.get(Categoria, cat_id)
            if not cat or not cat.is_active:
                raise HTTPException(status_code=404, detail=f"Categoria with id {cat_id} not found")
            self.session.add(
                ProductoCategoria(producto_id=producto.id, categoria_id=cat.id)
            )

        for ing_id in producto_in.ingredientes_ids:
            ing = self.session.get(Ingrediente, ing_id)
            if not ing or not ing.is_active:
                raise HTTPException(status_code=404, detail=f"Ingrediente with id {ing_id} not found")
            self.session.add(
                ProductoIngrediente(producto_id=producto.id, ingrediente_id=ing.id)
            )

        self.session.flush()
        return producto

    def update(self, producto_id: int, producto_in: ProductoCreate):
        producto = self.get_by_id(producto_id)

        producto.nombre = producto_in.nombre
        producto.precio = producto_in.precio
        producto.descripcion = producto_in.descripcion

        # Delete existing relationships
        for pc in self.session.exec(
            select(ProductoCategoria).where(
                ProductoCategoria.producto_id == producto.id
            )
        ).all():
            self.session.delete(pc)
        for pi in self.session.exec(
            select(ProductoIngrediente).where(
                ProductoIngrediente.producto_id == producto.id
            )
        ).all():
            self.session.delete(pi)

        # Add new relationships
        for cat_id in producto_in.categorias_ids:
            cat = self.session.get(Categoria, cat_id)
            if not cat or not cat.is_active:
                raise HTTPException(status_code=404, detail=f"Categoria with id {cat_id} not found")
            self.session.add(
                ProductoCategoria(producto_id=producto.id, categoria_id=cat.id)
            )

        for ing_id in producto_in.ingredientes_ids:
            ing = self.session.get(Ingrediente, ing_id)
            if not ing or not ing.is_active:
                raise HTTPException(status_code=404, detail=f"Ingrediente with id {ing_id} not found")
            self.session.add(
                ProductoIngrediente(producto_id=producto.id, ingrediente_id=ing.id)
            )

        self.session.flush()
        return producto

    def delete(self, producto_id: int):
        producto = self.get_by_id(producto_id)
        producto.is_active = False
        self.session.add(producto)
        self.session.flush()
        return producto
