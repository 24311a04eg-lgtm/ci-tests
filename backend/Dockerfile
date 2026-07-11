# This Dockerfile expects the build context to be the project root
# (message-app/), so it can copy both backend/ and frontend/.
# Example: docker build -f backend/Dockerfile -t message-app-backend .

# --- Install dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# --- Runtime image ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY backend/ ./
COPY frontend/ /frontend/

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
  && chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
