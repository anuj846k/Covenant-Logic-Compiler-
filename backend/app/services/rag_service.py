"""RAG service for document indexing and semantic search using ChromaDB."""

import hashlib

import chromadb
from chromadb.utils import embedding_functions


class RAGService:
    """Vector store service for indexing and querying large documents."""

    def __init__(self, persist_directory: str = "./chroma_db"):
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.embedding_function = (
            embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="all-MiniLM-L6-v2"
            )
        )

    def create_collection(self, collection_name: str):
        """Create or get a collection for storing document chunks."""
        return self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_function,
            metadata={"hnsw:space": "cosine"},
        )

    def chunk_text(
        self, text: str, chunk_size: int = 2000, overlap: int = 200
    ) -> list[dict]:
        """Split text into overlapping chunks for embedding."""
        chunks = []
        start = 0
        chunk_id = 0

        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end]

            if end < len(text):
                for boundary in [". ", ".\n", "\n\n", "\n"]:
                    last_boundary = chunk_text.rfind(boundary)
                    if last_boundary > chunk_size * 0.5:
                        chunk_text = chunk_text[: last_boundary + 1]
                        end = start + len(chunk_text)
                        break

            page_num = None
            if "[PAGE " in chunk_text:
                try:
                    page_start = chunk_text.find("[PAGE ") + 6
                    page_end = chunk_text.find("]", page_start)
                    page_num = int(chunk_text[page_start:page_end])
                except ValueError:
                    pass

            chunks.append(
                {
                    "id": f"chunk_{chunk_id}",
                    "text": chunk_text,
                    "start_char": start,
                    "end_char": end,
                    "page": page_num,
                }
            )

            chunk_id += 1
            start = end - overlap

        return chunks

    def index_document(self, document_id: str, text: str) -> int:
        """Index a document into the vector store. Returns number of chunks."""
        collection_name = f"doc_{hashlib.md5(document_id.encode()).hexdigest()[:12]}"
        collection = self.create_collection(collection_name)

        if collection.count() > 0:
            print(
                f"Document {document_id} already indexed with {collection.count()} chunks"
            )
            return collection.count()

        chunks = self.chunk_text(text)

        ids = [chunk["id"] for chunk in chunks]
        documents = [chunk["text"] for chunk in chunks]
        metadatas = [
            {
                "document_id": document_id,
                "start_char": chunk["start_char"],
                "end_char": chunk["end_char"],
                "page": chunk["page"] or 0,
            }
            for chunk in chunks
        ]

        collection.add(ids=ids, documents=documents, metadatas=metadatas)
        print(f"Indexed {len(chunks)} chunks for document {document_id}")
        return len(chunks)

    def query(self, document_id: str, query: str, n_results: int = 10) -> list[dict]:
        """Query the vector store for relevant chunks."""
        collection_name = f"doc_{hashlib.md5(document_id.encode()).hexdigest()[:12]}"

        try:
            collection = self.client.get_collection(
                name=collection_name, embedding_function=self.embedding_function
            )
        except ValueError:
            raise ValueError(f"Document {document_id} not indexed.")

        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            include=["documents", "metadatas", "distances"],
        )

        chunks = []
        for i in range(len(results["ids"][0])):
            chunks.append(
                {
                    "id": results["ids"][0][i],
                    "text": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "similarity": 1 - results["distances"][0][i],
                }
            )

        return chunks

    def get_relevant_text(
        self, document_id: str, queries: list[str], n_per_query: int = 5
    ) -> str:
        """Get combined relevant text for multiple queries."""
        all_chunks = {}

        for query in queries:
            chunks = self.query(document_id, query, n_results=n_per_query)
            for chunk in chunks:
                if chunk["id"] not in all_chunks:
                    all_chunks[chunk["id"]] = chunk

        sorted_chunks = sorted(
            all_chunks.values(), key=lambda x: x["metadata"]["start_char"]
        )

        combined_text = "\n\n---\n\n".join(
            [
                f"[Chunk from Page {c['metadata']['page']}]\n{c['text']}"
                for c in sorted_chunks
            ]
        )

        return combined_text

    def delete_document(self, document_id: str):
        """Delete a document from the vector store."""
        collection_name = f"doc_{hashlib.md5(document_id.encode()).hexdigest()[:12]}"
        try:
            self.client.delete_collection(collection_name)
        except ValueError:
            pass
