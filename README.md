# Coleta de dados de Clima (NestJS, Vite, Go, Python)

##  Objetivo
Implementação de uma arquitetura de microsserviços para coleta, processamento em fila e análise de dados de clima, com um dashboard de visualização em tempo real.

##  Arquitetura
O sistema é composto por 6 serviços orquestrados via Docker Compose:
1.  **backend-nestjs (API):** Lógica principal, Autenticação, Insights de IA e Endpoints de exportação.
2.  **frontend-react (Vite):** Interface de usuário e consumo da API.
3.  **collector-python:** Coleta dados de clima de uma API externa (OpenWeatherMap) e publica na fila.
4.  **worker-go-consumer:** Consome a fila do RabbitMQ e persiste os dados no MongoDB.
5.  **mongodb:** Banco de dados de persistência.
6.  **rabbitmq (Message Broker):** Fila para desacoplar o coletor do worker.

##  Como Rodar o Projeto

### Pré-requisitos
**Git**, **Docker** e **Docker Compose**.

### Passos
1.  **Configuração do Ambiente:** Crie o arquivo `.env` na raiz do projeto, copiando o conteúdo do **`.env.example`**.
2.  **Chave da API:** Insira sua chave de teste da OpenWeatherMap na variável `OPENWEATHER_API_KEY` dentro do seu novo arquivo `.env`.
3.  **Execução:** Na raiz do projeto, execute o comando para construir e iniciar todos os serviços:
    ```bash
    docker compose up -d --build
    ```

##  URLs Principais

| Serviço | URL |
| :--- | :--- |
| **Frontend (Dashboard)** | `http://localhost:5173` |
| **API (Documentação Swagger)** | `http://localhost:3000/api` |

##  Credenciais de Teste
Para acesso inicial, utilize o usuário padrão:

* **Usuário:** `admin`
* **Senha:** `senha123`
