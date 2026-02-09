FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update and install necessary packages
# wget/unzip: for downloading Godot
# git: for cloning repos
# nodejs/npm: for the backend server
# libfontconfig1, libxcursor1, libxinerama1, libxrandr2, libxi6, libgl1: Godot dependencies
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    git \
    curl \
    libfontconfig1 \
    libxcursor1 \
    libxinerama1 \
    libxrandr2 \
    libxi6 \
    libgl1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

# --- Install Godot ---
ENV GODOT_VERSION=4.3
ENV GODOT_GAME_URL=https://github.com/godotengine/godot/releases/download/${GODOT_VERSION}-stable/Godot_v${GODOT_VERSION}-stable_linux.x86_64.zip
ENV GODOT_TEMPLATES_URL=https://github.com/godotengine/godot/releases/download/${GODOT_VERSION}-stable/Godot_v${GODOT_VERSION}-stable_export_templates.tpz

# Download and install Godot
RUN wget -q ${GODOT_GAME_URL} -O godot.zip && \
    unzip godot.zip && \
    mv Godot_v${GODOT_VERSION}-stable_linux.x86_64 /usr/local/bin/godot && \
    chmod +x /usr/local/bin/godot && \
    rm godot.zip

# Download and install Export Templates
RUN mkdir -p /root/.local/share/godot/export_templates/${GODOT_VERSION}.stable && \
    wget -q ${GODOT_TEMPLATES_URL} -O templates.tpz && \
    unzip -q templates.tpz && \
    mv templates/* /root/.local/share/godot/export_templates/${GODOT_VERSION}.stable/ && \
    rm -rf templates templates.tpz

# Verify Godot installation
RUN godot --version

# --- Backend Setup ---

COPY package*.json ./
RUN npm install

COPY . .

# Set GODOT_PATH env var for the app
ENV GODOT_PATH=/usr/local/bin/godot
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "dev"]
