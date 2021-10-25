#!/bin/bash
docker build -t app .
docker run -d --name regen_app localhost/app:latest
docker cp regen_app:/app/leap_index.json ./