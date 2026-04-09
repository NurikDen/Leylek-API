#!/bin/bash

# Leylek Deployment Script
# Deploys the project to SSH server: 10.93.24.193

set -e

SSH_USER="root"
SSH_HOST="10.93.24.193"
REMOTE_DIR="/root/Leylek-API"

echo "🚀 Starting Leylek deployment to $SSH_HOST..."

# Step 1: Build frontend for production
echo "📦 Building frontend for production..."
cd frontend
npm install
npx vite build
cd ..

# Step 2: Copy frontend build to backend
echo "📋 Copying frontend build to backend..."
rm -rf backend/frontend-dist
cp -r frontend/dist backend/frontend-dist

# Step 3: Create remote directory
echo "📁 Creating remote directory..."
ssh $SSH_USER@$SSH_HOST "mkdir -p $REMOTE_DIR"

# Step 4: Transfer backend files
echo "📤 Transferring files to server..."
rsync -avz --exclude='venv' --exclude='__pycache__' --exclude='.pytest_cache' \
    backend/ $SSH_USER@$SSH_HOST:$REMOTE_DIR/backend/

# Step 5: Setup and start backend on server
echo "⚙️ Setting up backend on server..."
ssh root@10.93.24.193 << 'EOF'
cd /root/Leylek-API/backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate and install dependencies
source venv/bin/activate
pip install -r requirements.txt

# Kill any existing uvicorn processes
pkill -f "uvicorn main:app" 2>/dev/null || true
sleep 2

# Start backend on port 8000 (includes frontend)
echo "Starting Leylek server..."
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > /root/Leylek-API/backend.log 2>&1 &

echo "Server started. PID: $!"
EOF

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 Access your application:"
echo "   Frontend & API: http://10.93.24.193:8000"
echo "   API Docs: http://10.93.24.193:8000/docs"
echo ""
echo "📋 View logs on server:"
echo "   ssh root@10.93.24.193 'tail -f /root/Leylek-API/backend.log'"
echo ""
echo "🛑 Stop server:"
echo "   ssh root@10.93.24.193 'pkill -f uvicorn'"
echo ""
echo "🔄 Restart server:"
echo "   ssh root@10.93.24.193 'pkill -f uvicorn && cd /root/Leylek-API/backend && source venv/bin/activate && nohup uvicorn main:app --host 0.0.0.0 --port 8000 > /root/Leylek-API/backend.log 2>&1 &'"
