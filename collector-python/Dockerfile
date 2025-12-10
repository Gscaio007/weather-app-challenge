# Usa a imagem Python Alpine para ser leve
FROM python:3.11-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia e instala as dependências (assumindo que você usa um requirements.txt)
# Se você só tiver pika e requests, pode instalar diretamente
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código do coletor
COPY collector.py .

# Comando de execução do script Python
CMD ["python", "collector.py"]