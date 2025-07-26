FROM node:20 AS deps
WORKDIR /app
ENV NODE_ENV=production

# copy root package files first for better caching
COPY package*.json ./
# copy package files for api and frontend
COPY api/package*.json ./api/
COPY frontend-next/package*.json ./frontend-next/

# install production dependencies for all workspaces
RUN npm ci --omit=dev \
  && npm ci --omit=dev --prefix api \
  && npm ci --omit=dev --prefix frontend-next

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/api/node_modules ./api/node_modules
COPY --from=deps /app/frontend-next/node_modules ./frontend-next/node_modules

COPY . .

CMD ["npm", "start"]
