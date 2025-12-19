import pika
import requests
import json
import os
from dotenv import load_dotenv
import time
import random

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# --- Configurações ---
API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
RABBITMQ_PORT = os.getenv("RABBITMQ_PORT")
RABBITMQ_USER = os.getenv("RABBITMQ_USER")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS")
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE")

# Lista de cidades que você quer monitorar
CITIES = ["Recife,BR", "Sao Paulo,BR", "Rio de Janeiro,BR", "Belo Horizonte,BR"]

# --- Conexão e Envio ---

def connect_rabbitmq():
    """Conecta ao RabbitMQ com lógica de retry."""
    
    # 🌟 NOVAS VARIÁVEIS DE RETRY
    max_retries = 15 
    retry_delay = 5 # segundos

    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    parameters = pika.ConnectionParameters(
        host=RABBITMQ_HOST, 
        port=int(RABBITMQ_PORT), 
        credentials=credentials
    )
    
    for attempt in range(max_retries):
        try:
            print(f"[{attempt + 1}/{max_retries}] Tentando conectar ao RabbitMQ em {RABBITMQ_HOST}:{RABBITMQ_PORT}...")
            
            # Tenta a conexão (pode lançar pika.exceptions.AMQPConnectionError)
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()
            
            # Garante que a fila existe
            channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
            print(f"✅ Conexão RabbitMQ estabelecida e fila '{RABBITMQ_QUEUE}' declarada.")
            return connection, channel
        
        except pika.exceptions.AMQPConnectionError as e:
            if attempt < max_retries - 1:
                # ⚠️ Tentativa falhou, espera e tenta novamente
                print(f"⚠️ Falha na conexão. Tentando novamente em {retry_delay} segundos...")
                time.sleep(retry_delay)
            else:
                # 🛑 Todas as tentativas falharam
                print(f"🛑 ERRO: Não foi possível conectar ao RabbitMQ após {max_retries} tentativas. Erro: {e}")
                raise e # Lança o erro final
    

def fetch_weather(city, api_key):
    """Busca dados de clima da OpenWeatherMap."""
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    params = {
        'q': city,
        'appid': api_key,
        'units': 'metric'
    }
    
    print(f"Buscando dados para {city}...")
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status() # Lança exceção para erros HTTP
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao buscar clima para {city}: {e}")
        return None
    
    data = response.json()
    
    # Estrutura a mensagem que será enviada
    message = {
        "city": data.get("name"),
        "country": data.get("sys", {}).get("country"),
        "timestamp": int(time.time()),
        "temperature": data.get("main", {}).get("temp"),
        "humidity": data.get("main", {}).get("humidity"),
        "wind_speed": data.get("wind", {}).get("speed"),
        "description": data.get("weather", [{}])[0].get("description")
    }
    return json.dumps(message)

def run_collector():
    """Loop principal do Coletor."""
    if not API_KEY:
        print("🛑 ERRO: API_KEY não configurada no .env. Configure sua chave da OpenWeatherMap.")
        return

    connection = None
    
    try:
        # A nova função connect_rabbitmq() tenta várias vezes. Se falhar, lança o erro.
        connection, channel = connect_rabbitmq()
    except Exception as e:
        # O erro já foi impresso em connect_rabbitmq
        return

    try:
        while True:
            # Escolhe uma cidade aleatória para testar
            city = random.choice(CITIES)
            
            message_body = fetch_weather(city, API_KEY)
            
            if message_body:
                # Envia a mensagem para o RabbitMQ
                channel.basic_publish(
                    exchange='',
                    routing_key=RABBITMQ_QUEUE,
                    body=message_body,
                    properties=pika.BasicProperties(
                        delivery_mode=2, # Torna a mensagem persistente
                    ))
                print(f"  -> [ENVIADO] Mensagem para '{city}' enviada para a fila.")

            # Espera um pouco antes da próxima busca
            time.sleep(5) 

    except KeyboardInterrupt:
        print("\nColetor Python parado pelo usuário.")
    except Exception as e:
        print(f"\nOcorreu um erro na execução do coletor: {e}")
    finally:
        if connection and connection.is_open:
            connection.close()
            print("Conexão RabbitMQ encerrada.")

if __name__ == '__main__':
    run_collector()