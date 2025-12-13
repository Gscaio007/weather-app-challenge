# Estágio de Build (builder)
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração de dependências
COPY package.json package-lock.json ./

# Instala as dependências de produção e desenvolvimento
RUN npm install

# Copia o restante do código
COPY . .

# Compila o NestJS (isso cria a pasta 'dist')
RUN npm run build

# --- Estágio de Produção ---
FROM node:20-alpine AS production

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas as dependências de produção
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copia os arquivos compilados (que estão na pasta 'dist' dentro do container 'builder')
# CORREÇÃO CRÍTICA: Mudamos de /app/main.js para /app/dist/main.js
COPY --from=builder /app/dist/main.js .

# Copia os arquivos estáticos e outros módulos necessários (a pasta 'dist' inteira)
# Isso garante que a lógica da sua aplicação (módulos, serviços, controllers) seja incluída.
COPY --from=builder /app/dist ./dist 

# Define a porta que o NestJS usa
EXPOSE 3000

# Comando para iniciar a aplicação compilada
CMD [ "node", "dist/main.js" ]