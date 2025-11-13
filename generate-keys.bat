@echo off
REM Script para generar claves RSA para JWT RS256 en Windows

set KEYS_DIR=src\infrastructure\adapters\out\security\keys

REM Crear directorio si no existe
if not exist "%KEYS_DIR%" mkdir "%KEYS_DIR%"

REM Generar clave privada RSA de 2048 bits
openssl genrsa -out "%KEYS_DIR%\jwt-private.key" 2048

REM Extraer clave pública desde la privada
openssl rsa -in "%KEYS_DIR%\jwt-private.key" -pubout -out "%KEYS_DIR%\jwt-public.key"

echo Claves RSA generadas exitosamente:
echo   - Clave privada: %KEYS_DIR%\jwt-private.key
echo   - Clave publica: %KEYS_DIR%\jwt-public.key
echo.
echo IMPORTANTE: No compartas la clave privada. Agregala a .gitignore

pause
