from chromadb import PersistentClient
from chromadb.utils import embedding_functions
from app.core.config import settings

_client = None
_embedding_fn = None

def get_embedding_func():
    global _embedding_fn
    if _embedding_fn is None:
        _embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=settings.EMBEDDING_MODEL)
    return _embedding_fn
    
def get_chroma_client():
    global _client
    if _client is None:
        _client = PersistentClient(path=settings.CHROMA_PERSIST_DIR)
    return _client

def get_neetcode_collection():
    client = get_chroma_client()
    embedding_fn = get_embedding_func()
    return client.get_or_create_collection(
        name="neetcode",
        embedding_function=embedding_fn,
        metadata={"hnsw:space":"cosine"},
        
    )