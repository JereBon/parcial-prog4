from sqlmodel import Session, select
from fastapi import HTTPException
from ..models import Ingrediente
from ..schemas import IngredienteCreate

class IngredienteService:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self, skip: int = 0, limit: int = 100):
        return self.session.exec(select(Ingrediente).where(Ingrediente.is_active == True).offset(skip).limit(limit)).all()

    def get_by_id(self, ingrediente_id: int):
        ingrediente = self.session.get(Ingrediente, ingrediente_id)
        if not ingrediente or not ingrediente.is_active:
            raise HTTPException(status_code=404, detail="Ingrediente not found")
        return ingrediente

    def create(self, ingrediente_in: IngredienteCreate):
        ingrediente = Ingrediente.model_validate(ingrediente_in)
        self.session.add(ingrediente)
        self.session.flush()
        return ingrediente

    def update(self, ingrediente_id: int, ingrediente_in: IngredienteCreate):
        ingrediente = self.get_by_id(ingrediente_id)
        ingrediente_data = ingrediente_in.model_dump(exclude_unset=True)
        ingrediente.sqlmodel_update(ingrediente_data)
        self.session.add(ingrediente)
        self.session.flush()
        return ingrediente

    def delete(self, ingrediente_id: int):
        ingrediente = self.get_by_id(ingrediente_id)
        ingrediente.is_active = False
        self.session.add(ingrediente)
        self.session.flush()
        return ingrediente
