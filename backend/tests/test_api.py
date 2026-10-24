from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operacional"

def test_status_endpoint():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["total_ofertas"] > 0
    assert data["total_imagens"] > 0
    assert data["taxa_pareamento"] > 80.0

def test_offers_list():
    response = client.get("/api/offers")
    assert response.status_code == 200
    offers = response.json()
    assert len(offers) > 0
    primeira = offers[0]
    assert "descricao" in primeira
    assert "preco_oferta" in primeira
    assert "preco_oferta_str" in primeira

def test_images_list():
    response = client.get("/api/images")
    assert response.status_code == 200
    images = response.json()
    assert len(images) > 0

def test_export_generate_pdf():
    # Buscar ofertas ativas
    offers_resp = client.get("/api/offers")
    offers = offers_resp.json()[:8]
    
    payload = {
        "template_id": "a4_16",
        "formato": "pdf",
        "resolucao": "print",
        "tema_campanha": "carnaval",
        "titulo_campanha": "Carnaval de Ofertas São Judas",
        "subtitulo_campanha": "Supermercado da Família",
        "validade": "16/10 a 18/10/2026",
        "offers": offers
    }
    response = client.post("/api/export/generate", json=payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["sucesso"] is True
    assert "pdf" in res_data["arquivo_url"]
