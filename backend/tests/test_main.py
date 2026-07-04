from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_read_root():
    response = client.get('/')
    assert response.status_code == 200
    assert response.json()['project'] == 'week12-capstone-project'


def test_list_tasks():
    response = client.get('/api/tasks')
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_task():
    response = client.post('/api/tasks', json={'title': 'Write docs', 'description': 'Update the user guide'})
    assert response.status_code == 200
    body = response.json()
    assert body['title'] == 'Write docs'
    assert body['description'] == 'Update the user guide'
