# -------------------------------------------------------------------
# STAGE 1: Construção
# Usa uma imagem Node maior para instalar dependências e construir o código Vite
# -------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copia e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o código fonte do frontend
COPY . .

# Comando para construir a aplicação (Vite)
# Isso gera a pasta 'dist' com os arquivos estáticos
# Se o seu build for 'npm run build', use isso.
RUN npm run build 


# -------------------------------------------------------------------
# STAGE 2: Produção (Servindo com Nginx)
# Usa uma imagem Nginx limpa para servir os arquivos estáticos
# -------------------------------------------------------------------
FROM nginx:alpine

# Copia os arquivos estáticos compilados da etapa anterior (pasta dist)
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia uma configuração customizada do Nginx (se você tiver)
# Se você tiver um arquivo nginx.conf personalizado: 
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# A porta padrão do Nginx é 80
EXPOSE 80

# Comando padrão do Nginx para iniciar o servidor
CMD ["nginx", "-g", "daemon off;"]