from fastapi import FastAPI

app = FastAPI(title="SwellWise API")

@app.get("/health")
def health():
    return {"status": "ok"}