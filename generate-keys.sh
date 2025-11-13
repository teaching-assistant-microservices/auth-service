#!/bin/bash

# Script para generar claves RSA para JWT RS256

KEYS_DIR="src/infrastructure/adapters/out/security/keys"

# Crear directorio si no existe
mkdir -p "$KEYS_DIR"

# Generar clave privada RSA de 2048 bits
openssl genrsa -out "$KEYS_DIR/jwt-private.key" 2048

# Extraer clave pública desde la privada
openssl rsa -in "$KEYS_DIR/jwt-private.key" -pubout -out "$KEYS_DIR/jwt-public.key"

# Mostrar permisos restrictivos para la clave privada
chmod 600 "$KEYS_DIR/jwt-private.key"
chmod 644 "$KEYS_DIR/jwt-public.key"

echo "Claves RSA generadas exitosamente:"
echo "  - Clave privada: $KEYS_DIR/jwt-private.key"
echo "  - Clave pública: $KEYS_DIR/jwt-public.key"
echo ""
echo "IMPORTANTE: No compartas la clave privada. Agrégala a .gitignore"
