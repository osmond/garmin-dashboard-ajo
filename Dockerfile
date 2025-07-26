FROM node:20
WORKDIR /app

# copy root package files first for better caching
COPY package*.json ./
# copy package files for api and frontend
COPY api/package*.json ./api/
COPY frontend-next/package*.json ./frontend-next/

# install dependencies for all workspaces
RUN npm install \
  && npm install --prefix api \
  && npm install --prefix frontend-next

# copy the rest of the source code
COPY . .

# default command runs both API and frontend via the root start script
CMD ["npm", "start"]
