import sys
import json

from pathlib import Path

sys.path.append(str(Path(__file__).parents[2]))

from app.core.database import SessionLocal
from app.models.beach import Beach
import uuid


def create_slug(name: str) -> str:
    import unicodedata
    import re
    
    slug = unicodedata.normalize('NFKD', name)
    slug = slug.encode('ASCII', 'ignore').decode('ASCII')
    
    slug = slug.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    
    return slug


def populate_beaches():
    
    current_dir = Path(__file__).parent
    json_path = current_dir / "beaches.json"

    try:
        with open(json_path, 'r', encoding='utf-8') as file:
            beaches_data = json.load(file)
    except FileNotFoundError:
        print(f"Erro: Arquivo {json_path} não encontrado.")
        return
    except json.JSONDecodeError:
        print("Erro: O arquivo JSON está mal formatado.")
        return
    
    db = SessionLocal()
    
    try:
        print()
        
        # Track slugs used in this session to avoid duplicates within the same batch
        used_slugs = set()
        
        # Load existing slugs from database
        existing_slugs = db.query(Beach.slug).all()
        for (slug,) in existing_slugs:
            used_slugs.add(slug)
        
        for beach_data in beaches_data:
            # Verificar se já existe
            existing = db.query(Beach).filter(
                Beach.name == beach_data["name"],
                Beach.city == beach_data["city"]
            ).first()
            
            if existing:
                print(f"   {beach_data['name']} ({beach_data['city']}) - já existe")
                continue
            
            # Criar slug único (verificar tanto no BD quanto em used_slugs)
            slug = create_slug(beach_data["name"])
            original_slug = slug
            
            # Se slug já existe, adicionar a cidade (primeiras 3 letras)
            counter = 1
            while slug in used_slugs:
                slug = f"{original_slug}-{create_slug(beach_data['city'][:3])}"
                counter += 1
            
            used_slugs.add(slug)
            
            # Criar nova praia
            beach = Beach(
                id=str(uuid.uuid4())[:8],
                slug=slug,
                **beach_data
            )
            
            db.add(beach)
            print(f"   {beach_data['name']} ({beach_data['city']}, {beach_data['state']})")
        
        db.commit()
        print()
        
        # Mostrar contagem
        total = db.query(Beach).count()
        print(f" Total de praias no banco: {total}")
        
    except Exception as e:
        print(f"Erro: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    populate_beaches()
