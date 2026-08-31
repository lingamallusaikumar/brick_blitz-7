# Brick Blitz — Developer Automation Workflows

.PHONY: help install dev build test python-gen python-val docker-build docker-run clean

help:
	@echo "Available commands:"
	@echo "  make install      - Install npm dependencies"
	@echo "  make dev          - Start Vite local development server"
	@echo "  make build        - Build production bundle to dist/"
	@echo "  make test         - Run Vitest automated test suite"
	@echo "  make python-gen   - Run Python 3.10+ level generator"
	@echo "  make python-val   - Run Python 3.10+ level dataset validator"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run   - Run Docker container on port 8080"
	@echo "  make clean        - Clean build artifacts"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

python-gen:
	python python/level_generator.py

python-val:
	python python/validator.py

docker-build:
	docker build -t brick-blitz:latest .

docker-run:
	docker run -d -p 8080:80 --name brick_blitz_app brick-blitz:latest

clean:
	rm -rf dist node_modules coverage
