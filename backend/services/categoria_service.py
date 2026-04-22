from sqlmodel import Session, select
from fastapi import HTTPException
from ..models import Categoria
from ..schemas import CategoriaCreate

class CategoriaService:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self, skip: int = 0, limit: int = 100):
        return self.session.exec(select(Categoria).where(Categoria.is_active == True).offset(skip).limit(limit)).all()

    def get_by_id(self, categoria_id: int):
        categoria = self.session.get(Categoria, categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria not found")
        return categoria

    def create(self, categoria_in: CategoriaCreate):
        categoria = Categoria.model_validate(categoria_in)
        self.session.add(categoria)
        self.session.commit()
        self.session.refresh(categoria)
        return categoria

    def update(self, categoria_id: int, categoria_in: CategoriaCreate):
        categoria = self.get_by_id(categoria_id)
        categoria_data = categoria_in.model_dump(exclude_unset=True)
        categoria.sqlmodel_update(categoria_data)
        self.session.add(categoria)
        self.session.commit()
        self.session.refresh(categoria)
        return categoria

    def delete(self, categoria_id: int):
        categoria = self.get_by_id(categoria_id)
        categoria.is_active = False
        self.session.add(categoria)
        self.session.commit()
        return categoria
